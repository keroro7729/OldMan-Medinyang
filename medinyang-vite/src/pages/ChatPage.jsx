// ✅ ChatPage.jsx - 중복 이미지 방지 버전
import React, { useState, useEffect, useRef } from "react";
import ChatList from "../components/Chat/ChatList";
import ChatInput from "../components/Chat/ChatInput";
import TopHeader from "../components/TopHeader";
import BottomNav from "../components/BottomNav";
import { useLocation } from "react-router-dom";

// CSRF(JSON) 유틸
async function getCsrfToken() {
  const res = await fetch(`/api/csrf-token`, { credentials: "include" });
  if (!res.ok) throw new Error(`csrf-token 실패: ${res.status}`);
  const data = await res.json(); // { token }
  if (!data?.token) throw new Error("CSRF token 누락");
  return data.token;
}

const ChatPage = () => {
  const location = useLocation();

  const [messages, setMessages] = useState([]); // { sender, text?, type?, imageUrl?, name?, createdAt? }
  const [isReplying, setIsReplying] = useState(false);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const chatAreaRef = useRef(null);

  // ✅ 업로드 처리 가드 (StrictMode로 인한 이펙트 2회 실행 방지)
  const processedUploadIdRef = useRef(null);

  // 아래 헬퍼: 같은 내용이 이미 있으면 추가 안 함
  const pushUnique = (msg) => {
    setMessages((prev) => {
      const exists = prev.some((m) => {
        // 이미지 메시지는 URL 또는 파일명으로 중복 판단
        if (msg.type === "image" && m.type === "image") {
          return (
            (msg.imageUrl && m.imageUrl === msg.imageUrl) ||
            (msg.name && m.name === msg.name)
          );
        }
        // 텍스트 메시지는 sender+text 기준
        if (!msg.type && !m.type) {
          return m.sender === msg.sender && m.text === msg.text;
        }
        return false;
      });
      return exists ? prev : [...prev, msg];
    });
  };

  // 스크롤 하단 고정
  useEffect(() => {
    const el = chatAreaRef.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
  }, [messages]);

  // ✅ 업로드 페이지에서 전달된 안내문 + 이미지 미리보기 처리 (중복 방지)
  useEffect(() => {
    const st = location.state;
    if (!st?.fromUpload) return;

    // 1) 안내문(중복 방지)
    if (st.initialMessage) {
      pushUnique({ sender: "gpt", text: st.initialMessage });
    }

    // 2) 이미지 미리보기
    const uploaded = st.uploaded; // { attachmentId, key, fileName, contentType, previewUrl? }
    if (!uploaded) return;

    // 이미 같은 attachmentId를 처리했으면 스킵 (StrictMode 2회 방지)
    if (processedUploadIdRef.current === uploaded.attachmentId) return;
    processedUploadIdRef.current = uploaded.attachmentId;

    const showPreview = async () => {
      // presign GET에서 받은 URL이 이미 있으면 즉시
      if (uploaded.previewUrl) {
        pushUnique({
          sender: "gpt",
          type: "image",
          imageUrl: uploaded.previewUrl,
          name: uploaded.fileName,
        });
        return;
      }

      // 없으면 presign GET 요청
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
            inline: true,
            contentType: uploaded.contentType || "image/png",
          }),
        });
        if (!res.ok) throw new Error(`presign(get) 실패: ${res.status}`);
        const data = await res.json();
        pushUnique({
          sender: "gpt",
          type: "image",
          imageUrl: data.downloadUrl,
          name: uploaded.fileName,
        });
      } catch (e) {
        console.error(e);
        pushUnique({ sender: "gpt", text: "⚠️ 이미지 미리보기에 실패했냥." });
      }
    };

    showPreview();
    // location.state는 동일 객체 참조로 남을 수 있어, attachmentId만 의존성에 둠
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.state?.uploaded?.attachmentId]);

  // 이전 메세지 불러오기 (페이징)
  const fetchMessages = async (pageNumber = 0) => {
    if (!hasMore || isLoading) return;
    setIsLoading(true);

    try {
      const res = await fetch(`/api/chats?page=${pageNumber}&size=10`, {
        credentials: "include",
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const data = await res.json();
      const newMessages = (data.content || [])
        .slice()
        .reverse()
        .flatMap((item) => [
          { sender: "user", text: item.content, createdAt: item.createdAt },
          { sender: "gpt", text: item.response, createdAt: item.createdAt },
        ]);

      setMessages((prev) => {
        const keys = new Set(
          prev.map(
            (m) => `${m.createdAt}|${m.sender}|${m.text || m.imageUrl || ""}`
          )
        );
        const filtered = newMessages.filter(
          (m) => !keys.has(`${m.createdAt}|${m.sender}|${m.text || ""}`)
        );
        return [...filtered, ...prev];
      });

      setPage((data.number ?? pageNumber) + 1);
      setHasMore(!data.last);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // 초기 페이지 로드
  useEffect(() => {
    fetchMessages(0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 스크롤 상단 근처 → 다음 페이지
  const handleScroll = () => {
    const chatDiv = chatAreaRef.current;
    if (!chatDiv || isLoading || !hasMore) return;
    if (chatDiv.scrollTop < 50) {
      fetchMessages(page);
    }
  };

  // 사용자 메시지 전송
  const handleSend = async (text) => {
    const content = (text || "").trim();
    if (!content || isReplying) return;

    setIsReplying(true);
    try {
      const res = await fetch(`/api/chats`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ content }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const data = await res.json(); // { content, response, createdAt }
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
            onImageUpload={(file) => console.log("이미지 업로드됨:", file)}
          />
        </div>

        <div style={styles.bottomNavWrapper}>
          <BottomNav current="chat" />
        </div>
      </div>
    </div>
  );
};

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
    marginTop: "56px",
    marginBottom: "96px",
  },
  inputWrapper: {
    position: "fixed",
    bottom: "64px",
    left: "50%",
    transform: "translateX(-50%)",
    width: "100%",
    maxWidth: "430px",
    backgroundColor: "#fff",
    paddingBottom: "env(safe-area-inset-bottom)",
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
