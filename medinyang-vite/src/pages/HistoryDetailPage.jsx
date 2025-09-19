// ✅ HistoryDetailPage.jsx - 의료 이력 상세 보기 페이지
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import TopHeader from "../components/common/TopHeader";

const HistoryDetailPage = () => {
  const { id } = useParams();
  const [detail, setDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDetail = async () => {
      setLoading(true);
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/medical-images/${id}`,
          {
            withCredentials: true,
            headers: {
              "ngrok-skip-browser-warning": "69420",
            },
          }
        );
        const { status, data, message } = res.data;

        if (status !== 200) throw new Error(message || "조회 실패");

        setDetail(data);
      } catch (err) {
        console.error("❌ 상세 조회 실패:", err);
        setError("상세 정보를 불러오지 못했습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchDetail();
  }, [id]);

  if (loading) return <p style={{ padding: "20px" }}>불러오는 중입니다...</p>;
  if (error) return <p style={{ color: "red", padding: "20px" }}>{error}</p>;

  return (
    <div style={{ padding: "0px" }}>
      <TopHeader title="이력 상세보기" />

      <div style={{ marginTop: "16px", padding: "20px" }}>
        {/* OCR로 업로드된 의료 이미지 출력 */}
        {detail.base64Image && (
          <img
            src={`data:image/png;base64,${detail.base64Image}`}
            alt="의료 이미지"
            style={{
              width: "100%",
              maxWidth: "600px",
              margin: "20px 0",
              borderRadius: "8px",
            }}
          />
        )}

        {/* AI 분석 결과 출력 */}
        <p><strong>AI 분석 결과:</strong></p>
        <pre
          style={{
            whiteSpace: "pre-wrap",
            background: "#f9f9f9",
            padding: "10px",
            borderRadius: "6px",
          }}
        >
          {detail.longDescription}
        </pre>
      </div>
    </div>
  );
};

export default HistoryDetailPage;
