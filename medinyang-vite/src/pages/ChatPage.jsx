// ✅ ChatPage.jsx - 메디냥 AI 챗봇 페이지 (더미 응답 버전 + 고정 레이아웃)
import React, { useState, useEffect } from "react";
import ChatList from "../components/Chat/ChatList";
import ChatInput from "../components/Chat/ChatInput";
import TopHeader from "../components/TopHeader";
import BottomNav from "../components/BottomNav"; // ✅ 하단 네비게이션
import { useLocation } from "react-router-dom";

const ChatPage = () => {
  const location = useLocation();
  const [messages, setMessages] = useState([]);
  const [isReplying, setIsReplying] = useState(false);

  // ✅ 초기 환영 메시지 출력
  useEffect(() => {
    setMessages([{ sender: "gpt", text: "오늘은 어떤 건강 고민이 있냥? 🐾" }]);
  }, []);

  // ✅ 업로드 페이지에서 넘어온 경우 메시지 추가
  useEffect(() => {
    if (location.state?.fromUpload && location.state.initialMessage) {
      setMessages((prev) => [
        ...prev,
        { sender: "gpt", text: location.state.initialMessage },
      ]);
    }
  }, [location.state]);

  // ✅ 사용자 메시지 전송 처리
  const handleSend = (text) => {
    if (!text.trim() || isReplying) return;

    setMessages((prev) => [...prev, { sender: "user", text }]);
    setIsReplying(true);

    // 1초 뒤 더미 응답
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { sender: "gpt", text: `메디냥이 답변해줄게냥: "${text}"` },
      ]);
      setIsReplying(false);
    }, 1000);
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
    backgroundColor: "#D1E3FF", // 바깥 배경
  },
  container: {
    position: "relative",
    maxWidth: "430px", // 고정 레이아웃
    width: "100%",
    height: "100%",
    backgroundColor: "#f5f5f5",
    display: "flex",
    flexDirection: "column",
  },
  chatArea: {
    position: "absolute",
    top: "56px",
    bottom: "96px", // 입력창 위까지
    left: 0,
    right: 0,
    overflowY: "auto",
    padding: "16px",
  },
  inputWrapper: {
    position: "fixed",
    bottom: "64px", // ✅ 네비게이션 위에 고정
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
