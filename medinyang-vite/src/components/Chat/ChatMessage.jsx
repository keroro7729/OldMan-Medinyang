import React from "react";
import MedinyangIcon from "../../assets/medi_doctor.png";

// ✅ ChatMessage: 한 줄의 채팅 메시지를 보여주는 컴포넌트
const ChatMessage = ({ sender = "gpt", text, type, imageUrl, name, error }) => {
  const isUser = sender === "user";
  const isSystem = sender === "system";
  const isImage = type === "image";

  // 공통 말풍선 스타일(사용자/봇 공용 베이스)
  const bubbleBase = {
    maxWidth: "75%",
    padding: "8px 12px",
    borderRadius: "16px",
    display: "inline-block",
    wordBreak: "break-word",
    whiteSpace: "pre-wrap",
    color: "#000",
  };

  // 사용자/봇 색상
  const userBubble = { ...bubbleBase, backgroundColor: "#A7D8F0" };
  const botBubble = {
    ...bubbleBase,
    backgroundColor: "#FFFFFF",
    border: "1px solid #E5E7EB",
  };

  // 이미지 카드 스타일
  const imageCard = {
    display: "inline-block",
    maxWidth: "85%",
    backgroundColor: "#FFFFFF",
    border: "1px solid #E5E7EB",
    borderRadius: 12,
    overflow: "hidden",
  };

  // 파일명/캡션 바
  const captionBar = {
    fontSize: 12,
    color: "#6B7280",
    borderTop: "1px solid #E5E7EB",
    padding: "6px 8px",
    background: "#FAFAFB",
  };

  if (isSystem) {
    // ✅ 시스템 안내문 (가운데 회색, 작게)
    return (
      <div style={{ textAlign: "center", margin: "12px 0" }}>
        <span
          style={{
            display: "inline-block",
            fontSize: 12,
            color: "#6B7280",
            background: "#EEF2FF",
            padding: "6px 10px",
            borderRadius: 12,
          }}
        >
          {text}
        </span>
      </div>
    );
  }

  // ✅ 이미지 메시지
  if (isImage && imageUrl) {
    return (
      <div
        style={{
          textAlign: isUser ? "right" : "left",
          marginBottom: 16,
        }}
      >
        {/* 봇일 때 아이콘 여백 맞춤 */}
        {!isUser && (
          <div
            style={{
              marginLeft: 0,
              marginBottom: 6,
              display: "flex",
              alignItems: "flex-end",
              gap: 8,
            }}
          >
            {/* 아이콘 좌측 배치하고 싶으면 여기서 추가 가능 */}
          </div>
        )}

        <div style={imageCard}>
          <img
            src={imageUrl}
            alt={name || "uploaded"}
            style={{
              display: "block",
              maxWidth: "100%",
              height: "auto",
            }}
          />
          {name && <div style={captionBar}>{name}</div>}
        </div>

        {/* GPT 아이콘 (기존 스타일 유지: 하단 고정 느낌) */}
        {!isUser && (
          <div style={{ marginTop: 6 }}>
            <img
              src={MedinyangIcon}
              alt="메디냥"
              width={48}
              height={45}
              style={{ width: 48, height: 45, borderRadius: "50%" }}
            />
          </div>
        )}
      </div>
    );
  }

  // ✅ 일반 텍스트 메시지
  return (
    <div
      style={{
        textAlign: isUser ? "right" : "left",
        marginBottom: 16,
      }}
    >
      {isUser ? (
        // 사용자 말풍선
        <div style={userBubble}>{text}</div>
      ) : (
        // GPT 텍스트 + 메디냥 아이콘 (기존 구조 유지)
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
          }}
        >
          <div
            style={{
              ...botBubble,
              marginLeft: 0, // 기존 "아이콘 오른쪽으로 밀기" 대신 말풍선에 테두리 적용
              borderColor: error ? "#FCA5A5" : "#E5E7EB",
              backgroundColor: error ? "#FEF2F2" : "#FFFFFF",
            }}
          >
            {text}
          </div>
          <img
            src={MedinyangIcon}
            alt="메디냥"
            style={{ width: 48, height: 45, borderRadius: "50%", marginTop: 6 }}
          />
        </div>
      )}
    </div>
  );
};

export default ChatMessage;
