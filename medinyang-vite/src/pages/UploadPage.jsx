// ✅ UploadPage.jsx - 발표용 프로토타입 (OCR 이미지 URL 전송 + 채팅 페이지 이동)
import React, { useState, useRef } from "react";
import TopHeader from "../components/TopHeader";
import { useNavigate } from "react-router-dom";

const UploadPage = () => {
  const [fileName, setFileName] = useState("선택된 파일 없음");
  const [selectedFile, setSelectedFile] = useState(null);
  const [error, setError] = useState("");
  const fileInputRef = useRef(null);
  const navigate = useNavigate();
  const validExtensions = ["jpg", "jpeg", "png", "bmp"];

  const demoImageUrl = "https://keroro7729.github.io/image/처방전.jpg";

  // ✅ 파일 선택창 열기
  const triggerFileSelect = () => fileInputRef.current.click();

  // ✅ 파일 선택 시 처리
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const ext = file.name.split(".").pop().toLowerCase();
    if (!validExtensions.includes(ext)) {
      setSelectedFile(null);
      setFileName("선택된 파일 없음");
      setError("❗ 이미지 파일 형식이 아닙니다. (JPG, JPEG, PNG, BMP만 허용)");
      return;
    }

    setSelectedFile(file);
    setFileName(file.name);
    setError("");
  };

  // ✅ 업로드 버튼 클릭 시
  const handleUpload = async () => {
    if (!selectedFile) return alert("⚠️ 파일을 먼저 선택해주세요.");

    try {
      // 👉 프로토타입: 실제 업로드 없이 이미 호스팅된 이미지 URL 사용
      const res = await fetch("http://localhost:8080/api/chats/ocr", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageUrl: demoImageUrl }),
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      // const data = await res.json(); // 응답 사용 안 함
      // OCR 결과는 ChatPage에서 GET 요청으로 불러오기 때문에 여기서는 무시

      // ✅ 채팅 페이지로 이동
      navigate("/chat", {
        state: {
          fromUpload: true,
          initialMessage:
            "✅ 이미지 업로드 완료! OCR 분석 결과는 채팅창에서 확인할 수 있어요.",
        },
      });
    } catch (err) {
      console.error(err);
      alert("서버와 연결할 수 없습니다. 잠시 후 다시 시도해주세요.");
    }
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        width: "100%",
        height: "100vh",
        backgroundColor: "#D1E3FF",
      }}
    >
      {/* 중앙 컨테이너 */}
      <div
        style={{
          position: "relative",
          maxWidth: "430px",
          width: "100%",
          height: "100%",
          backgroundColor: "#f5f5f5",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <TopHeader title="의료 기록 업로드" />

        {/* 콘텐츠 영역 */}
        <div style={{ padding: "20px", overflowY: "auto", flex: 1 }}>
          {/* 파일 선택 */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "8px",
              gap: "12px",
              flexWrap: "wrap",
            }}
          >
            <span
              style={{
                fontSize: "14px",
                color: error ? "red" : "#333",
                flex: 1,
                marginLeft: "8px",
              }}
            >
              {error || fileName}
            </span>
            <button
              onClick={triggerFileSelect}
              style={{
                backgroundColor: "#3B82F6",
                color: "#ffffff",
                fontWeight: "bold",
                fontSize: "12px",
                padding: "6px 12px",
                borderRadius: "6px",
                marginRight: "30px",
                cursor: "pointer",
                whiteSpace: "nowrap",
              }}
            >
              파일선택
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".jpg,.jpeg,.png,.bmp"
              onChange={handleFileChange}
              style={{ display: "none" }}
            />
          </div>

          {/* 안내 문구 */}
          <p style={{ fontSize: "12px", color: "#9CA3AF", marginBottom: "24px" }}>
            10MB 이하의 이미지 파일만 등록할 수 있습니다. (JPG, JPEG, PNG, BMP)
          </p>

          {/* 업로드 가이드 */}
          <div style={{ marginBottom: "24px" }}>
            <h3 style={{ fontSize: "14px", fontWeight: "bold", marginBottom: "8px" }}>
              📸 사진 업로드 시 주의사항
            </h3>
            <div
              style={{
                width: "100%",
                height: "220px",
                backgroundColor: "#E5E7EB",
                borderRadius: "10px",
                marginBottom: "10px",
              }}
            />
            <ul
              style={{
                fontSize: "13px",
                color: "#4B5563",
                lineHeight: "1.6",
                paddingLeft: "1rem",
              }}
            >
              <li> 문서 전체가 잘 보이도록 촬영해주세요.</li>
              <li> 빛 반사가 없도록 해주세요.</li>
              <li> 초점이 맞지 않으면 인식이 어려울 수 있어요.</li>
            </ul>
          </div>
        </div>

        {/* 업로드 버튼 */}
        <div style={{ padding: "20px" }}>
          <button
            onClick={handleUpload}
            style={{
              width: "100%",
              backgroundColor: "#3B82F6",
              color: "#ffffff",
              fontWeight: "bold",
              padding: "12px",
              fontSize: "16px",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
              marginBottom: "70px",
            }}
          >
            업로드
          </button>
        </div>
      </div>
    </div>
  );
};

export default UploadPage;
