// ✅ ChatPage.jsx - 메디냥 AI 챗봇 페이지 (백엔드 연동 + 이전 메시지 페이징)
import React, { useState, useEffect, useRef } from "react";
import ChatList from "../components/Chat/ChatList";
import ChatInput from "../components/Chat/ChatInput";
import TopHeader from "../components/TopHeader";
import BottomNav from "../components/BottomNav";
import { useLocation } from "react-router-dom";

const ChatPage = () => {
  const location = useLocation();

  // 상태
  const [messages, setMessages] = useState([]);
  const [isReplying, setIsReplying] = useState(false);
  const [page, setPage] = useState(0);         // 현재 페이지
  const [hasMore, setHasMore] = useState(true); // 더 가져올 데이터 존재 여부
  const [isLoading, setIsLoading] = useState(false);

  const chatAreaRef = useRef(null);

//   // ✅ 초기 환영 메시지
//   useEffect(() => {
//     setMessages([{ sender: "gpt", text: "오늘은 어떤 건강 고민이 있냥? 🐾" }]);
//   }, []);

  // ✅ 업로드 페이지에서 초기 메시지 전달된 경우
  useEffect(() => {
    if (location.state?.fromUpload && location.state.initialMessage) {
      setMessages((prev) => [
        ...prev,
        { sender: "gpt", text: location.state.initialMessage },
      ]);
    }
  }, [location.state]);

useEffect(() => {
  if (location.state?.fromUpload && location.state.initialMessage) {
    setMessages(prev => {
      const exists = prev.some(m => m.text === location.state.initialMessage && m.sender === "gpt");
      if (exists) return prev;
      return [...prev, { sender: "gpt", text: location.state.initialMessage }];
    });
  }
}, [location.state]);

  // 이전 메세지 불러오기
  const fetchMessages = async (pageNumber = 0) => {
    if (!hasMore || isLoading) return;
    setIsLoading(true);

    try {
      const res = await fetch(`http://localhost:8080/api/chats?page=${pageNumber}&size=10`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const data = await res.json();

      // 서버에서 받은 메시지를 최신 -> 과거 순서이므로 reverse
      const newMessages = (data.content || [])
        .slice() // 원본 보호
        .reverse()
        .map(item => {
          return [
            { sender: "user", text: item.content, createdAt: item.createdAt },
            { sender: "gpt", text: item.response, createdAt: item.createdAt }
          ];
        })
        .flat();

      // 중복 방지: 기존 메시지와 같은 createdAt 메시지는 제외
      setMessages(prev => {
        const existingKeys = new Set(prev.map(m => m.createdAt + m.sender));
        const filtered = newMessages.filter(m => !existingKeys.has(m.createdAt + m.sender));
        return [...filtered, ...prev];
      });

      setPage(data.number + 1);
      setHasMore(!data.last);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };



  // ✅ 초기 페이지 0 불러오기
  useEffect(() => {
    fetchMessages(0);
  }, []);

  // ✅ 스크롤 업 이벤트 (최상단 근처 시 이전 페이지 불러오기)
  const handleScroll = () => {
    const chatDiv = chatAreaRef.current;
    if (!chatDiv || isLoading || !hasMore) return;

    if (chatDiv.scrollTop < 50) {
      fetchMessages(page);
    }
  };

  // ✅ 사용자 메시지 전송
  const handleSend = async (text) => {
    const content = (text || "").trim();
    if (!content || isReplying) return;

    setIsReplying(true);
    try {
      const res = await fetch("http://localhost:8080/api/chats", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const data = await res.json(); // => { content, response, createdAt }

      const { content: serverContent, response, createdAt } = data || {};
      if (typeof serverContent !== "string" || typeof response !== "string") {
        throw new Error("Invalid schema from /api/chats");
      }

      setMessages((prev) => [
        ...prev,
        { sender: "user", text: serverContent, createdAt },
        { sender: "gpt",  text: response,       createdAt },
      ]);
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        { sender: "gpt", text: "서버와 연결할 수 없냥. 잠시 후 다시 시도해줘!", error: true },
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
        <div
          style={styles.chatArea}
          ref={chatAreaRef}
          onScroll={handleScroll}
        >
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
