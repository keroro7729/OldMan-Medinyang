import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShoppingBag } from "@fortawesome/free-solid-svg-icons";

import cat1 from "../assets/cat1.png";
import bgMain from "../assets/bg-main.png"; // ✅ 배경 이미지 import
import BottomNav from "../components/BottomNav"; // ✅ 하단 네비게이션 컴포넌트 import

const MainPage = () => {
  const navigate = useNavigate();
  const [showInventory, setShowInventory] = useState(false);

  return (
    <>
      <div className="main-wrapper">
        <div className="main-container">
          {/* 상단 장바구니 */}
          <div className="cart-button">
            <button onClick={() => setShowInventory(true)}>
              <FontAwesomeIcon
                icon={faShoppingBag}
                size="lg"
                className="cart-icon"
              />
            </button>
          </div>

          {/* 인벤토리 모달 */}
          {showInventory && (
            <div className="modal-overlay">
              <div className="modal-box">
                <p>인벤토리 (빈 화면)</p>
                <button
                  className="modal-close"
                  onClick={() => setShowInventory(false)}
                >
                  닫기
                </button>
              </div>
            </div>
          )}

          {/* 메인 콘텐츠 */}
          <div className="main-content">
            {/* 말풍선 */}
            <div className="speech-bubble">
              <p>오늘의 건강 상태는 어떻냥?</p>
              <div className="bubble-tail"></div>
            </div>

            {/* 고양이 */}
            <img src={cat1} alt="cat" className="main-cat" />

            {/* 답변 버튼 */}
            <button onClick={() => navigate("/chat")} className="answer-btn">
              답변하러가기 →
            </button>
          </div>

          {/* ✅ 하단 네비게이션 (컴포넌트 적용) */}
          <BottomNav current="main" />
        </div>
      </div>

      {/* ✅ CSS-in-JS */}
      <style>{`
        .main-wrapper {
          display: flex;
          justify-content: center;
          align-items: center;
          width: 100%;
          height: 100vh;
          background-color: #d1e3ff;
        }
        .main-container {
          position: relative;
          max-width: 430px;
          width: 100%;
          height: 100%;
          background-image: url(${bgMain});
          background-size: cover;
          background-position: center;
          background-repeat: no-repeat;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }
        .cart-button {
          position: absolute;
          top: 16px;
          left: 16px;
        }
        .cart-icon {
          color: #4a4a4a;
        }
        .modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 50;
        }
        .modal-box {
          background: white;
          width: 300px;
          height: 400px;
          border-radius: 16px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
        }
        .modal-close {
          margin-top: 16px;
          color: #2563eb;
          text-decoration: underline;
          background: none;
          border: none;
          cursor: pointer;
        }
        .main-content {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          flex: 1;
        }
        .speech-bubble {
          position: relative;
          background: rgba(255, 255, 255, 0.9);
          box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15);
          border-radius: 16px;
          padding: 8px 16px;
          margin-bottom: 16px;
          font-weight: 600;
          color: #333;
        }
        .bubble-tail {
          position: absolute;
          bottom: -8px;
          left: 24px;
          width: 16px;
          height: 16px;
          background: rgba(255, 255, 255, 0.9);
          box-shadow: 0 2px 5px rgba(0, 0, 0, 0.15);
          transform: rotate(45deg);
        }
        .main-cat {
          width: 160px;
          height: auto;
        }
        .answer-btn {
          margin-top: 24px;
          background: #3b6e22;
          color: white;
          padding: 12px 24px;
          border-radius: 9999px;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
          border: none;
          cursor: pointer;
          font-size: 16px;
          font-weight: 600;
        }
        .answer-btn:hover {
          background: #2f541a;
        }
      `}</style>
    </>
  );
};

export default MainPage;
