import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// 고양이 이미지 3개 import
import cat1 from "../assets/cat1.png";
import cat2 from "../assets/cat2.png";
import cat3 from "../assets/cat3.png";
import bgLoading from "../assets/bg-loading.png";

const LoadingPage = () => {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const cats = [cat1, cat2, cat3];

  // 이미지 순환
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % cats.length);
    }, 400); // 0.5초마다 이미지 변경

    // 3초 후 메인 화면으로 이동
    const timer = setTimeout(() => {
      navigate("/main");
    }, 4000);

    return () => {
      clearInterval(interval);
      clearTimeout(timer);
    };
  }, [navigate]);

  return (
    <>
      <div className="loading-wrapper">
        {/* 중앙 고정된 메인 영역 */}
        <div
          className="loading-container"
          style={{
            backgroundImage: `url(${bgLoading})`,
          }}
        >
          {/* 중앙 고양이 */}
          <img
            src={cats[currentIndex]}
            alt="loading cat"
            className="loading-cat"
          />
        </div>
      </div>

      {/* ✅ CSS 포함 */}
      <style>{`
        .loading-wrapper {
          display: flex;
          justify-content: center;
          align-items: center;
          width: 100%;
          height: 100vh;
          background-color: #d1e3ff;
        }
        .loading-container {
          position: relative;
          max-width: 430px;
          width: 100%;
          height: 100%;
          background-size: cover;
          background-position: center;
          background-repeat: no-repeat;
          display: flex;
          justify-content: center;
          align-items: center;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
        }
        .loading-cat {
          width: 160px;
          height: 160px;
          animation: bounce 1s infinite;
        }
        @keyframes bounce {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-15px);
          }
        }
      `}</style>
    </>
  );
};

export default LoadingPage;
