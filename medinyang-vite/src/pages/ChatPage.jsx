// ✅ ChatPage.jsx - 메디냥 AI 챗봇 페이지 (S3 업로드 미리보기 표시 + 백엔드 연동 + 이전 메시지 페이징)
import React, { useState, useEffect, useRef } from "react";
import ChatList from "../components/Chat/ChatList";
import ChatInput from "../components/Chat/ChatInput";
import TopHeader from "../components/TopHeader";
import BottomNav from "../components/BottomNav";
import { useLocation } from "react-router-dom";

// ✅ 쿠키 대신 JSON으로 CSRF 토큰 받아오기 (필요 시 사용)
async function getCsrfToken() {
  const res = await fetch(`/api/csrf-token`, { credentials: "include" });
  if (!res.ok) throw new Error(`csrf-token 실패: ${res.status}`);
  const data = await res.json(); // { token: "..." }
  if (!data?.token) throw new Error("CSRF token 누락");
  return data.token;
}

const ChatPage = () => {
  const location = useLocation();

  const [messages, setMessages] = useState([]); // { sender:'user'|'gpt'|'system', text?, createdAt?, type?, imageUrl?, name? }
  const [isReplying, setIsReplying] = useState(false);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const chatAreaRef = useRef(null);

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

    // 1) 안내문 중복 방지
    if (st.initialMessage) {
      setMessages((prev) => {
        const exists = prev.some(
          (m) => m.sender === "gpt" && m.text === st.initialMessage
        );
        if (exists) return prev;
        return [...prev, { sender: "gpt", text: st.initialMessage }];
      });
    }

    // 2) 이미지 미리보기
    const uploaded = st.uploaded; // { attachmentId, key, fileName, contentType, previewUrl? }
    if (!uploaded) return;

    const showPreview = async () => {
      if (uploaded.previewUrl) {
        setMessages((prev) => [
          ...prev,
          {
            sender: "gpt",
            type: "image",
            imageUrl: uploaded.previewUrl,
            name: uploaded.fileName,
          },
        ]);
        return;
      }

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
        setMessages((prev) => [
          ...prev,
          {
            sender: "gpt",
            type: "image",
            imageUrl: data.downloadUrl,
            name: uploaded.fileName,
          },
        ]);
      } catch (e) {
        console.error(e);
        setMessages((prev) => [
          ...prev,
          { sender: "gpt", text: "⚠️ 이미지 미리보기에 실패했냥." },
        ]);
      }
    };

    showPreview();
  }, [location.state]);

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
      setMessages((prev) => [
        ...prev,
        {
          sender: "gpt",
          text: "서버와 연결할 수 없냥. 잠시 후 다시 시도해줘!",
          error: true,
        },
      ]);
    } finally {
      setIsReplying(false);
    }
  };

  return (
    <div style={styles.wrapper}>
      <div style={styles.container}>
        <TopHeader title="메디냥 AI" />

        {/* 채팅 영역 */}
        <div style={styles.chatArea} ref={chatAreaRef} onScroll={handleScroll}>
          <ChatList messages={messages} />
        </div>

        {/* 입력창 */}
        <div style={styles.inputWrapper}>
          <ChatInput
            onSend={handleSend}
            isReplying={isReplying}
            onImageUpload={(file) => console.log("이미지 업로드됨:", file)}
          />
        </div>

        {/* 하단 네비게이션 */}
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
