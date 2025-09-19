// ✅ ChatPage.jsx - 메디냥 AI 챗봇 페이지
import React, { useState, useEffect, useRef } from "react";
import ChatList from "../components/Chat/ChatList";
import ChatInput from "../components/Chat/ChatInput";
import TopHeader from "../components/common/TopHeader";
import { useAuth } from "../context/AuthContext";
import { useLocation } from "react-router-dom";

const ChatPage = () => {
  const { isLoggedIn, loading } = useAuth(); // 로그인 상태 및 로딩 여부
  const location = useLocation();            // 이전 페이지에서 전달된 상태 확인
  const [messages, setMessages] = useState([]);   // 채팅 메시지 상태
  const [isReplying, setIsReplying] = useState(false); // GPT 응답 중 여부
  const socket = useRef(null);                    // WebSocket 인스턴스 저장

  // ✅ 업로드 페이지에서 넘어온 경우 초기 메시지를 첫 메시지로 출력
  useEffect(() => {
    if (location.state?.fromUpload && location.state.initialMessage) {
      setMessages([{ sender: "gpt", text: location.state.initialMessage }]);
    }
  }, [location.state]);

  // ✅ WebSocket 연결 설정 및 수신 이벤트 핸들링
  useEffect(() => {
    if (loading) return;
    if (!isLoggedIn) {
      console.log("로그인되지 않아 WebSocket 연결을 생략합니다.");
      return;
    }

    // localStorage에서 JSESSIONID 불러오기 (세션 인증용)
    const jsessionId = localStorage.getItem("jsessionId");
    if (!jsessionId) {
      console.warn("❌ 세션 ID 없음");
      return;
    }

    // ✅ WebSocket 연결 생성
    socket.current = new WebSocket(
      `${import.meta.env.VITE_WS_BASE_URL}/ws/chat?jsession=${jsessionId}`
    );

    // ✅ 메시지 수신 시 처리
    socket.current.onmessage = (event) => {
      const data = JSON.parse(event.data); // 서버에서 받은 JSON 파싱
      const gptReply = { sender: "gpt", text: data.reply };
      setMessages((prev) => [...prev, gptReply]); // GPT 응답 추가
      setIsReplying(false);
    };

    // ✅ 연결 종료 시 로그 출력
    socket.current.onclose = (event) => {
      console.warn("웹소켓 연결 종료");
      console.warn("code:", event.code);
      console.warn("reason:", event.reason);
      console.warn("wasClean:", event.wasClean);
    };

    // ✅ 컴포넌트 언마운트 시 WebSocket 정리
    return () => socket.current?.close();
  }, [isLoggedIn, loading]);

  // ✅ 사용자 메시지 전송 처리
  const handleSend = (text) => {
    if (!text.trim() || isReplying) return;

    setMessages((prev) => [...prev, { sender: "user", text }]); // 사용자 메시지 추가
    setIsReplying(true);

    if (socket.current?.readyState === WebSocket.OPEN) {
      socket.current.send(JSON.stringify({ message: text })); // 서버로 메시지 전송
    }
  };

  // ✅ 응답 중단 요청 처리
  const handleStop = () => {
    if (socket.current?.readyState === WebSocket.OPEN) {
      socket.current.send(JSON.stringify({ stop: true })); // stop 신호 전송
    }
    setIsReplying(false);
  };

  // ✅ 로딩 중 또는 로그인되지 않았을 경우 예외 처리
  if (loading) return <p>로딩 중입니다...</p>;
  if (!isLoggedIn) return <p>로그인이 필요합니다.</p>;

  return (
    <div
      style={{
        height: "100dvh",
        width: "100vw",
        backgroundColor: "#f5f5f5",
        overflow: "hidden",
        position: "relative",
      }}
    >
      {/* 상단 고정 헤더 */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          zIndex: 1000,
          backgroundColor: "#fff",
          boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
        }}
      >
        <TopHeader title="메디냥 AI" />
      </div>

      {/* 채팅 메시지 리스트 출력 영역 */}
      <div
        style={{
          position: "absolute",
          top: "56px",
          bottom: "96px",
          left: 0,
          right: 0,
          overflowY: "auto",
          padding: "16px",
          WebkitOverflowScrolling: "touch",
        }}
      >
        <ChatList messages={messages} />
      </div>

      {/* 입력창 고정 영역 */}
      <div
        style={{
          position: "fixed",
          bottom: 0,
          left: 0,
          width: "100%",
          zIndex: 1000,
          backgroundColor: "#fff",
          paddingBottom: "env(safe-area-inset-bottom)",
        }}
      >
        <ChatInput
          onSend={handleSend}           // 메시지 전송 함수 전달
          onStop={handleStop}           // 중단 버튼 함수 전달
          isReplying={isReplying}       // 응답 중 상태 전달
          onImageUpload={(file) => console.log("이미지 업로드됨:", file)} // 이미지 업로드 처리
        />
      </div>
    </div>
  );
};

export default ChatPage;
