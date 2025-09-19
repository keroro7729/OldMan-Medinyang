import React, { useState, useRef } from "react";
import TopHeader from "../components/common/TopHeader";
import BottomNav from "../components/Main/BottomNav";
import { useNavigate } from "react-router-dom";

const UploadPage = () => {
  const [fileName, setFileName] = useState("선택된 파일 없음");
  const [selectedFile, setSelectedFile] = useState(null);
  const [error, setError] = useState("");
  const fileInputRef = useRef(null);
  const navigate = useNavigate();
  const validExtensions = ["jpg", "jpeg", "png", "bmp"];

  const triggerFileSelect = () => fileInputRef.current.click();

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

  const handleUpload = async () => {
    if (!selectedFile) return alert("⚠️ 파일을 먼저 선택해주세요.");
    try {
      const formData = new FormData();
      formData.append("image", selectedFile);

      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/medical-images/upload`,
        {
          method: "POST",
          headers: {
            "ngrok-skip-browser-warning": "69420", // ✅ 이거만 추가
          },
          body: formData,
          credentials: "include",
        }
      );

      if (!response.ok) throw new Error("업로드 실패");

      const result = await response.json();
      console.log("✅ 서버 응답:", result);

      navigate("/chat", {
        state: {
          fromUpload: true,
          initialMessage: result.longDescription,
        },
      });
    } catch (err) {
      console.error(err);
      alert("❌ 업로드 실패: " + err.message);
    }
  };

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
      <div
        style={{
          width: "100",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          backgroundColor: "#f5f5f5",
        }}
      >
        <TopHeader title="의료 기록 업로드" />
        <div style={{ padding: "20px", overflowY: "auto", flex: 1 }}>
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
          <p
            style={{ fontSize: "12px", color: "#9CA3AF", marginBottom: "24px" }}
          >
            10MB 이하의 이미지 파일만 등록할 수 있습니다. (JPG, JPEG, PNG, BMP)
          </p>
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
      <BottomNav current="manage" />
    </div>
  );
};

export default UploadPage;
