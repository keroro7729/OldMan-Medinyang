// ✅ ChatPage.jsx - 메디냥 AI 챗봇 페이지 (백엔드 연동 버전)
import React, { useState, useEffect } from "react";
import ChatList from "../components/Chat/ChatList";
import ChatInput from "../components/Chat/ChatInput";
import TopHeader from "../components/TopHeader";
import BottomNav from "../components/BottomNav";
import { useLocation } from "react-router-dom";

const ChatPage = () => {
  const location = useLocation();
  const [messages, setMessages] = useState([]);
  const [isReplying, setIsReplying] = useState(false);

  // ✅ 초기 환영 메시지
  useEffect(() => {
    setMessages([{ sender: "gpt", text: "오늘은 어떤 건강 고민이 있냥? 🐾" }]);
  }, []);

  // ✅ 업로드 페이지에서 초기 메시지 전달된 경우
  useEffect(() => {
    if (location.state?.fromUpload && location.state.initialMessage) {
      setMessages((prev) => [
        ...prev,
        { sender: "gpt", text: location.state.initialMessage },
      ]);
    }
  }, [location.state]);

  // ✅ 사용자 메시지 전송 처리 (fetch 사용)
  const handleSend = async (text) => {
    const content = (text || "").trim();
    if (!content || isReplying) return;

    // 1) 사용자 말풍선 먼저 추가
    setMessages((prev) => [...prev, { sender: "user", text: content }]);
    setIsReplying(true);

    try {
      // 2) POST 요청
      const res = await fetch("http://localhost:8080/api/chats", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content }),
      });

      if (!res.ok) {
        throw new Error(`서버 오류: ${res.status}`);
      }

      const data = await res.json(); // { content, response, createdAt }

      // 3) GPT 말풍선 추가
      setMessages((prev) => [
        ...prev,
        { sender: "gpt", text: data.response, createdAt: data.createdAt },
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
        <div style={styles.chatArea}>
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

        {/* ✅ 하단 네비게이션 (항상 고정) */}
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
    position: "absolute",
    top: "56px",
    bottom: "96px",
    left: 0,
    right: 0,
    overflowY: "auto",
    padding: "16px",
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
