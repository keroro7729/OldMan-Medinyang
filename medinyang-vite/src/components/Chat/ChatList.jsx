import React, { useEffect, useRef } from "react";
import ChatMessage from "./ChatMessage";

// ✅ ChatList: 채팅 메시지 리스트를 보여주는 컴포넌트
const ChatList = ({ messages }) => {
  const chatEndRef = useRef(null); // 스크롤 이동을 위한 ref

  // ✅ 메시지가 추가될 때마다 아래로 자동 스크롤
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div style={{ flex: 1, overflowY: "auto", padding: "16px" }}>
      {/* ✅ 각 메시지를 ChatMessage 컴포넌트로 출력 */}
      {messages.map((msg, idx) => (
        <ChatMessage
          key={idx}              // 각 메시지의 고유 key
          sender={msg.sender}    // 보낸 사람 (user 또는 gpt)
          text={msg.text}        // 메시지 본문
        />
      ))}

      {/* ✅ 아래로 스크롤 이동을 위한 더미 div */}
      <div ref={chatEndRef} />
    </div>
  );
};

export default ChatList;
