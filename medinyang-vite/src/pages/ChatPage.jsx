// ChatPage.jsx - 업로드→채팅 전환 시 중복 이미지/안내문을 방지하고,
//    과거 대화를 페이지네이션으로 안정적으로 불러오는 채팅 화면.
// ──────────────────────────────────────────────────────────────────────
// [아키텍처 전제]
// - 인증: Spring Security + OAuth2 세션. fetch는 credentials:'include'로 세션 쿠키를 전송.
// - CSRF: 백엔드가 /api/csrf-token 을 통해 JSON {token} 발급(CookieCsrfTokenRepository withHttpOnlyFalse).
//         state-changing 요청 시 헤더 X-XSRF-TOKEN로 첨부.
// - 업로드: 업로드 페이지에서 S3 presign(put)→S3 업로드→/attachments/complete 후,
//          이 페이지(ChatPage)로 location.state를 통해 업로드 메타를 전달(fromUpload=true).
// - 미리보기: 이 페이지에서 presign(get)으로 signed GET URL을 받아 <img src>에 주입.
// - 대화 로드: /api/chats?page&size (백엔드 페이징 DTO: {content[], number, last,...}) 기준.
// ──────────────────────────────────────────────────────────────────────

import React, { useState, useEffect, useRef } from "react";
import ChatList from "../components/Chat/ChatList";
import ChatInput from "../components/Chat/ChatInput";
import TopHeader from "../components/TopHeader";
import BottomNav from "../components/BottomNav";
import { useLocation } from "react-router-dom";

// CSRF(JSON) 유틸
// - 목적: state-changing 요청(POST 등) 전에 CSRF 토큰을 확보.
// - 계약: GET /api/csrf-token → 200 OK, body: { token: "..." }
//         (Cookie XSRF-TOKEN도 함께 세팅되지만 여기서는 JSON token을 직접 헤더로 사용)
async function getCsrfToken() {
  const res = await fetch(`/api/csrf-token`, { credentials: "include" });
  if (!res.ok) throw new Error(`csrf-token 실패: ${res.status}`);
  const data = await res.json(); // { token }
  if (!data?.token) throw new Error("CSRF token 누락");
  return data.token;
}

const ChatPage = () => {
  const location = useLocation(); // 업로드 페이지에서 넘어온 상태(location.state) 읽기

  // messages: 렌더링에 쓰는 채팅 메시지 배열
  // - 스키마: { sender: 'user'|'gpt', text?, type?, imageUrl?, name?, createdAt? }
  const [messages, setMessages] = useState([]);
  const [isReplying, setIsReplying] = useState(false); // 사용자가 전송 중일 때 입력 잠금
  const [page, setPage] = useState(0); // 다음에 불러올 페이지 번호
  const [hasMore, setHasMore] = useState(true); // 더 불러올 페이지 존재 여부(백엔드의 last 플래그에 종속)
  const [isLoading, setIsLoading] = useState(false); // 페이징 로딩 중 여부

  const chatAreaRef = useRef(null); // 스크롤 컨테이너 참조

  // 업로드 처리 가드: React StrictMode에서 effect가 2회 실행되는 것을 구분하기 위한 가드.
  // - 같은 attachmentId를 두 번 처리하지 않도록 마지막 처리 ID를 저장.
  const processedUploadIdRef = useRef(null);

  // pushUnique: 동일 메시지 중복 렌더 방지
  // - 이미지: imageUrl 또는 파일명(name)으로 중복 판단
  // - 텍스트: sender+text 조합으로 판단
  //   (백엔드 재응답/라우팅 왕복 중복, StrictMode 재실행 등에서 안전)
  const pushUnique = (msg) => {
    setMessages((prev) => {
      const exists = prev.some((m) => {
        if (msg.type === "image" && m.type === "image") {
          return (
            (msg.imageUrl && m.imageUrl === msg.imageUrl) ||
            (msg.name && m.name === msg.name)
          );
        }
        if (!msg.type && !m.type) {
          return m.sender === msg.sender && m.text === msg.text;
        }
        return false;
      });
      return exists ? prev : [...prev, msg];
    });
  };

  // 새 메시지 도착 시 항상 스크롤을 하단으로 고정
  // - UX 목적: 최신 대화가 보이도록 유지.
  useEffect(() => {
    const el = chatAreaRef.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
  }, [messages]);

  // (A) 업로드→채팅 전환 초기 처리: 안내문 + 이미지 미리보기
  // - location.state 구조 예시:
  //   {
  //     fromUpload: true,
  //     initialMessage: "업로드 요약 안내문...",
  //     uploaded: { attachmentId, key, fileName, contentType, previewUrl? }
  //   }
  // - presign(GET)은 ChatPage에서 발급(보안상 서버 권한 검증을 거치기 위함)
  useEffect(() => {
    const st = location.state;
    if (!st?.fromUpload) return; // 업로드 페이지에서 온 경우에만 동작

    // 1) 업로드 안내문(중복 방지)
    if (st.initialMessage) {
      pushUnique({ sender: "gpt", text: st.initialMessage });
    }

    // 2) 이미지 미리보기: 업로드된 첨부의 presigned GET URL 확보
    const uploaded = st.uploaded; // { attachmentId, key, fileName, contentType, previewUrl? }
    if (!uploaded) return;

    // StrictMode 2회 실행 방지: 동일 attachmentId는 한 번만 처리
    if (processedUploadIdRef.current === uploaded.attachmentId) return;
    processedUploadIdRef.current = uploaded.attachmentId;

    const showPreview = async () => {
      // 업로드 페이지 단계에서 이미 previewUrl이 계산되었으면 그대로 사용
      if (uploaded.previewUrl) {
        pushUnique({
          sender: "gpt",
          type: "image",
          imageUrl: uploaded.previewUrl,
          name: uploaded.fileName,
        });
        return;
      }

      // 없으면 여기서 presign GET 발급 → 보안: 서버가 소유자/권한을 검증
      try {
        const xsrf = await getCsrfToken();
        const res = await fetch(`/api/attachments/presign/get`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-XSRF-TOKEN": xsrf,
          },
          credentials: "include",
          body: JSON.stringify({
            attachmentId: uploaded.attachmentId,
            inline: true, // 브라우저 미리보기 의도 (서버가 ContentDisposition/Type 제어 가능)
            contentType: uploaded.contentType || "image/png",
          }),
        });
        if (!res.ok) throw new Error(`presign(get) 실패: ${res.status}`);
        const data = await res.json(); // { downloadUrl }
        pushUnique({
          sender: "gpt",
          type: "image",
          imageUrl: data.downloadUrl,
          name: uploaded.fileName,
        });
      } catch (e) {
        console.error(e);
        // 사용자 메시지: 과한 기술 설명 대신 간단한 안내
        pushUnique({ sender: "gpt", text: "⚠️ 이미지 미리보기에 실패했냥." });
      }
    };

    showPreview();
    // 의존성: location.state 객체는 동일 참조로 유지될 수 있으니
    // 업로드 식별자인 attachmentId만 바라보도록 최소화
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.state?.uploaded?.attachmentId]);

  // (B) 과거 대화 페이징 로드
  // - 계약: GET /api/chats?page={n}&size=10
  //   응답 예: { content:[{content, response, createdAt}, ...], number, last, ... }
  // - 프런트 처리: 역순(reverse)로 정렬해서 시간순으로 위에서 아래로 보이도록 구성.
  // - 중복 방지: createdAt|sender|text 키로 세트 구성해 필터링.
  const fetchMessages = async (pageNumber = 0) => {
    if (!hasMore || isLoading) return; // 중복 호출 방지
    setIsLoading(true);

    try {
      const res = await fetch(`/api/chats?page=${pageNumber}&size=10`, {
        credentials: "include",
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const data = await res.json();
      const newMessages = (data.content || [])
        .slice()
        .reverse() // 가장 오래된 항목이 앞에 오도록 역순 → 아래 flatMap으로 user/gpt 쌍으로 변환
        .flatMap((item) => [
          { sender: "user", text: item.content, createdAt: item.createdAt },
          { sender: "gpt", text: item.response, createdAt: item.createdAt },
        ]);

      // 기존 키셋으로 중복 제거 (스크롤 경계/재호출 대비)
      setMessages((prev) => {
        const keys = new Set(
          prev.map(
            (m) => `${m.createdAt}|${m.sender}|${m.text || m.imageUrl || ""}`
          )
        );
        const filtered = newMessages.filter(
          (m) => !keys.has(`${m.createdAt}|${m.sender}|${m.text || ""}`)
        );
        return [...filtered, ...prev]; // 과거 대화는 위쪽에 붙인다.
      });

      // next page 계산 및 더 불러올 수 있는지 플래그 업데이트
      setPage((data.number ?? pageNumber) + 1);
      setHasMore(!data.last);
    } catch (err) {
      console.error(err);
      // (옵션) 사용자 메시지 토스트 가능
    } finally {
      setIsLoading(false);
    }
  };

  // 초기 1페이지 로드
  useEffect(() => {
    fetchMessages(0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 스크롤 상단 근접 시 다음 페이지 요청 (무한 스크롤의 "위로 당기기" 버전)
  // - UX: 채팅 맨 위 근처로 스크롤되면 과거 대화 10개 로드
  const handleScroll = () => {
    const chatDiv = chatAreaRef.current;
    if (!chatDiv || isLoading || !hasMore) return;
    if (chatDiv.scrollTop < 50) {
      fetchMessages(page);
    }
  };

  // 사용자가 메시지를 전송하는 핸들러
  // - 계약: POST /api/chats body: { content: "..." }
  //         res: { content, response, createdAt }
  // - 응답 즉시 화면에 user→gpt 쌍으로 추가
  // - 실패 시 gpt 메시지 형태로 안내(네트워크/서버 오류 구분은 콘솔 로그로 충분)
  const handleSend = async (text) => {
    const content = (text || "").trim();
    if (!content || isReplying) return;

    setIsReplying(true);
    try {
      // 1️⃣ CSRF 토큰 확보
      const xsrf = await getCsrfToken();

      // 2️⃣ 채팅 POST
      const res = await fetch(`/api/chats`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-XSRF-TOKEN": xsrf, // 서버에서 CookieCsrfTokenRepository 사용 시 필수
        },
        credentials: "include", // 세션 쿠키 전송
        body: JSON.stringify({ content }),
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json(); // { content, response, createdAt }

      // 3️⃣ 응답 구조 검증
      const { content: serverContent, response, createdAt } = data || {};
      if (typeof serverContent !== "string" || typeof response !== "string") {
        throw new Error("Invalid schema from /api/chats");
      }

      setMessages((prev) => [
        ...prev,
        { sender: "user", text: serverContent, createdAt },
        { sender: "gpt", text: response, createdAt },
      ]);
    } catch (err) {
      console.error(err);
      pushUnique({
        sender: "gpt",
        text: "서버와 연결할 수 없냥. 잠시 후 다시 시도해줘!",
        error: true,
      });
    } finally {
      setIsReplying(false);
    }
  };

  // 레이아웃: 상단 헤더 / 스크롤 가능한 채팅 영역 / 하단 입력창 & 바텀 네비
  // - 모바일 고정폭(최대 430px)로 중앙 정렬. iOS 안전영역 고려.
  return (
    <div style={styles.wrapper}>
      <div style={styles.container}>
        <TopHeader title="메디냥 AI" />

        <div style={styles.chatArea} ref={chatAreaRef} onScroll={handleScroll}>
          <ChatList messages={messages} />
        </div>

        <div style={styles.inputWrapper}>
          <ChatInput
            onSend={handleSend}
            isReplying={isReplying}
            onImageUpload={(file) => console.log("이미지 업로드됨:", file)} // (확장) 이미지 전송 연결지점
          />
        </div>

        <div style={styles.bottomNavWrapper}>
          <BottomNav current="chat" />
        </div>
      </div>
    </div>
  );
};

// 인라인 스타일: 시안 고정폭 모바일 레이아웃
const styles = {
  wrapper: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: "100vh",
    backgroundColor: "#D1E3FF",
  },
  container: {
    position: "relative",
    maxWidth: "430px",
    width: "100%",
    height: "100%",
    backgroundColor: "#f5f5f5",
    display: "flex",
    flexDirection: "column",
  },
  chatArea: {
    flex: 1,
    overflowY: "auto",
    padding: "16px",
    marginTop: "56px", // TopHeader 높이 보정
    marginBottom: "96px", // 하단 입력/네비 높이 보정
  },
  inputWrapper: {
    position: "fixed",
    bottom: "64px", // BottomNav 위에 배치
    left: "50%",
    transform: "translateX(-50%)",
    width: "100%",
    maxWidth: "430px",
    backgroundColor: "#fff",
    paddingBottom: "env(safe-area-inset-bottom)", // iOS 홈바 영역
    zIndex: 25,
  },
  bottomNavWrapper: {
    position: "fixed",
    bottom: 0,
    left: "50%",
    transform: "translateX(-50%)",
    width: "100%",
    maxWidth: "430px",
    zIndex: 30,
  },
};

export default ChatPage;
