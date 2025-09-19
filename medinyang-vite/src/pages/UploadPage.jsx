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

  // ✅ 업로드 버튼 클릭 시 (현재는 더미 처리)
  const handleUpload = async () => {
    if (!selectedFile) return alert("⚠️ 파일을 먼저 선택해주세요.");

    // 👉 실제 API 연결 전, ChatPage로 넘기면서 더미 데이터 전달
    navigate("/chat", {
      state: {
        fromUpload: true,
        initialMessage:
          "✅ 파일이 업로드되었어요! OCR 분석 결과는 여기에 표시될 예정입니다.",
      },
    });
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        width: "100%",
        height: "100vh",
        backgroundColor: "#D1E3FF", // 바깥 배경 (LoadingPage랑 동일)
      }}
    >
      {/* 중앙 고정 레이아웃 */}
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
        {/* 상단 헤더 */}
        <TopHeader title="의료 기록 업로드" />

        {/* 콘텐츠 */}
        <div style={{ padding: "20px", overflowY: "auto", flex: 1 }}>
          {/* 파일 선택 영역 */}
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

          {/* 안내문구 */}
          <p
            style={{ fontSize: "12px", color: "#9CA3AF", marginBottom: "24px" }}
          >
            10MB 이하의 이미지 파일만 등록할 수 있습니다. (JPG, JPEG, PNG, BMP)
          </p>

          {/* 업로드 가이드 */}
          <div style={{ marginBottom: "24px" }}>
            <h3
              style={{
                fontSize: "14px",
                fontWeight: "bold",
                marginBottom: "8px",
              }}
            >
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
