import React from "react";
import MedinyangIcon from "../../assets/medi_doctor.png";

// ✅ ChatMessage: 한 줄의 채팅 메시지를 보여주는 컴포넌트
const ChatMessage = ({ sender, text }) => {
  const isUser = sender === "user"; // 사용자 메시지인지 GPT 메시지인지 판별

  return (
    <div
      style={{
        textAlign: isUser ? "right" : "left",  // 사용자: 오른쪽 정렬 / GPT: 왼쪽 정렬
        marginBottom: "16px",                 // 메시지 간 간격
      }}
    >
      {isUser ? (
        // ✅ 사용자 메시지 말풍선
        <div
          style={{
            maxWidth: "70%",                  // 말풍선 최대 너비
            backgroundColor: "#A7D8F0",       // 밝은 파란색 배경
            padding: "8px 12px",
            borderRadius: "16px",             // 말풍선 형태
            display: "inline-block",
            color: "#000",
          }}
        >
          {text}
        </div>
      ) : (
        // ✅ GPT 메시지 + 메디냥 아이콘
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
          }}
        >
          {/* GPT 응답 텍스트 */}
          <div
            style={{
              color: "#000",
              whiteSpace: "pre-wrap",        // 줄바꿈 유지
              marginLeft: "65px",            // 아이콘 오른쪽으로 밀기
            }}
          >
            {text}
          </div>

          {/* 메디냥 아이콘 (하단 고정) */}
          <img
            src={MedinyangIcon}
            alt="메디냥"
            style={{ width: 48, height: 45, borderRadius: "50%" }}
          />
        </div>
      )}
    </div>
  );
};

export default ChatMessage;
