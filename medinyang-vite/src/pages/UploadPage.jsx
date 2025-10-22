// ✅ UploadPage.jsx - S3 Presigned 업로드 버전 (업로드 후 ChatPage에서 이미지 미리보기)
import React, { useState, useRef } from "react";
import TopHeader from "../components/TopHeader";
import { useNavigate } from "react-router-dom";

const MAX_SIZE = 10 * 1024 * 1024; // 10MB
const validExtensions = ["jpg", "jpeg", "png", "bmp"];

// ✅ 쿠키 대신 JSON으로 CSRF 토큰 받아오기
async function getCsrfToken() {
  const res = await fetch(`/api/csrf-token`, { credentials: "include" });
  if (!res.ok) throw new Error(`csrf-token 실패: ${res.status}`);
  const data = await res.json(); // { token: "..." }
  if (!data?.token) throw new Error("CSRF token 누락");
  return data.token;
}

const UploadPage = () => {
  const [fileName, setFileName] = useState("선택된 파일 없음");
  const [selectedFile, setSelectedFile] = useState(null);
  const [error, setError] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  const triggerFileSelect = () => fileInputRef.current?.click();

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const ext = file.name.split(".").pop().toLowerCase();
    if (!validExtensions.includes(ext)) {
      setSelectedFile(null);
      setFileName("선택된 파일 없음");
      setError("❗ 이미지 파일 형식이 아닙니다. (JPG, JPEG, PNG, BMP만 허용)");
      return;
    }
    if (file.size > MAX_SIZE) {
      setSelectedFile(null);
      setFileName("선택된 파일 없음");
      setError("❗ 파일 용량이 10MB를 초과합니다.");
      return;
    }

    setSelectedFile(file);
    setFileName(file.name);
    setError("");
  };

  // ✅ S3 Presigned 업로드 → complete → (옵션) presign GET → ChatPage로 이동
  const handleUpload = async () => {
    if (!selectedFile) return alert("⚠️ 파일을 먼저 선택해주세요.");
    setIsUploading(true);

    try {
      const xsrf = await getCsrfToken(); // JSON에서 token 받기
      const contentType = selectedFile.type || "application/octet-stream";

      // 1) presign PUT
      const presignPutRes = await fetch(`/api/attachments/presign/put`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-XSRF-TOKEN": xsrf,
        },
        credentials: "include",
        body: JSON.stringify({
          originalName: selectedFile.name,
          contentType,
        }),
      });
      if (!presignPutRes.ok) {
        const t = await presignPutRes.text();
        throw new Error(`presign(put) 실패: ${presignPutRes.status} ${t}`);
      }
      const presignPut = await presignPutRes.json(); // { attachmentId, key, uploadUrl }

      // 2) 브라우저 → S3에 직접 PUT
      const s3Put = await fetch(presignPut.uploadUrl, {
        method: "PUT",
        headers: { "Content-Type": contentType },
        body: selectedFile,
      });
      if (!s3Put.ok) {
        const t = await s3Put.text();
        throw new Error(`S3 업로드 실패: ${s3Put.status} ${t}`);
      }

      // 3) complete
      const xsrf2 = await getCsrfToken();
      const completeRes = await fetch(`/api/attachments/complete`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-XSRF-TOKEN": xsrf2,
        },
        credentials: "include",
        body: JSON.stringify({ attachmentId: presignPut.attachmentId }),
      });
      if (!completeRes.ok) {
        const t = await completeRes.text();
        throw new Error(`complete 실패: ${completeRes.status} ${t}`);
      }

      // 4) (선택) presign GET → 미리보기 URL
      let previewUrl = null;
      try {
        const xsrf3 = await getCsrfToken();
        const presignGetRes = await fetch(`/api/attachments/presign/get`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-XSRF-TOKEN": xsrf3,
          },
          credentials: "include",
          body: JSON.stringify({
            attachmentId: presignPut.attachmentId,
            inline: true,
            contentType,
          }),
        });
        if (presignGetRes.ok) {
          const presignGet = await presignGetRes.json();
          previewUrl = presignGet?.downloadUrl || null;
        } else {
          console.warn("presign(get) 실패, ChatPage에서 재요청 예정");
        }
      } catch (e) {
        console.warn("미리보기 URL 발급 생략(문제 없음):", e?.message || e);
      }

      // ✅ 채팅 페이지로 이동
      navigate("/chat", {
        state: {
          fromUpload: true,
          initialMessage:
            "✅ 이미지 업로드 완료! 아래 미리보기로 확인해보세요.",
          uploaded: {
            attachmentId: presignPut.attachmentId,
            key: presignPut.key,
            fileName: selectedFile.name,
            contentType,
            previewUrl,
          },
        },
      });
    } catch (err) {
      console.error(err);
      alert(err.message || "업로드 중 오류가 발생했습니다.");
    } finally {
      setIsUploading(false);
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
              disabled={isUploading}
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
              <li>문서 전체가 잘 보이도록 촬영해주세요.</li>
              <li>빛 반사가 없도록 해주세요.</li>
              <li>초점이 맞지 않으면 인식이 어려울 수 있어요.</li>
            </ul>
          </div>
        </div>

        <div style={{ padding: "20px" }}>
          <button
            onClick={handleUpload}
            style={{
              width: "100%",
              backgroundColor: isUploading ? "#93C5FD" : "#3B82F6",
              color: "#ffffff",
              fontWeight: "bold",
              padding: "12px",
              fontSize: "16px",
              border: "none",
              borderRadius: "6px",
              cursor: isUploading ? "not-allowed" : "pointer",
              marginBottom: "70px",
            }}
            disabled={isUploading}
          >
            {isUploading ? "업로드 중..." : "업로드"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default UploadPage;
