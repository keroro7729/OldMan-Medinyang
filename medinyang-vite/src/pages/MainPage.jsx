import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShoppingBag } from "@fortawesome/free-solid-svg-icons";

import baseCat from "../assets/cat1.png";
import bgMain from "../assets/bg-main.png";
import BottomNav from "../components/BottomNav";
import InventoryModal from "./InventoryModal";
import { useCat } from "../context/CatContext";

const MainPage = () => {
  const navigate = useNavigate();
  const [showInventory, setShowInventory] = useState(false);
  const { equipped } = useCat();

  return (
    <div className="main-wrapper">
      <div className="main-container">
        {/* 장바구니 버튼 */}
        <button className="cart-button" onClick={() => setShowInventory(true)}>
          <FontAwesomeIcon icon={faShoppingBag} className="cart-icon" />
        </button>

        {/* 인벤토리 모달 */}
        {showInventory && (
          <InventoryModal onClose={() => setShowInventory(false)} />
        )}

        {/* 메인 콘텐츠 */}
        <div className="main-content">
          {/* 말풍선 */}
          <div className="speech-bubble">
            <p>오늘 너의 건강 상태가 궁금하다냥!</p>
            <div className="bubble-tail"></div>
          </div>

          {/* 고양이 + 착용 아이템 */}
          <div className="cat-container">
            <img src={baseCat} alt="cat" className="main-cat" />

            {equipped["상의"] && (
              <img
                src={equipped["상의"].img}
                alt="상의"
                className="equip-img main-top-clothes"
              />
            )}
            {equipped["악세사리"] && (
              <img
                src={equipped["악세사리"].img}
                alt="악세사리"
                className="equip-img main-accessory"
              />
            )}
            {equipped["모자"] && (
              <img
                src={equipped["모자"].img}
                alt="모자"
                className="equip-img main-hat"
              />
            )}
          </div>

          {/* 버튼 */}
          <div className="button-wrapper">
            <button onClick={() => navigate("/chat")} className="answer-btn">
              답변하러가기 →
            </button>
          </div>
        </div>

        <BottomNav current="main" />
      </div>

      {/* ✅ CSS */}
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

        /* ✅ 파란색 원형 카트 버튼 */
        .cart-button {
          position: absolute;
          top: 16px;
          left: 16px;
          width: 48px;
          height: 48px;
          border-radius: 50%;
          background: #5C72BA;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 6px rgba(0,0,0,0.2);
          cursor: pointer;
          border: none;
          outline: none;
          transition: background 0.2s ease;
        }
        .cart-button:hover {
          background: #455A94;
        }
        .cart-icon {
          color: white;
          font-size: 20px;
        }

        .main-content {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: flex-start;
          flex: 1;
          padding-top: 60px;
        }
        .speech-bubble {
          position: relative;
          background: rgba(255, 255, 255, 0.9);
          box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15);
          border-radius: 16px;
          padding: 8px 40px;
          margin-top: 90px;
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
          transform: rotate(45deg);
        }

        .cat-container {
          position: relative;
          width: 200px;
          height: auto;
          margin-bottom: 40px;
        }
        .main-cat {
          width: 100%;
          height: auto;
          display: block;
          margin: 50px auto 0;
        }
        .equip-img {
          position: absolute;
          pointer-events: none;
        }

        /* 착용 아이템 위치 */
        .main-top-clothes {
          top: 135px;
          left: 50%;
          transform: translateX(-50%);
          width: 150px;
        }
        .main-accessory {
          top: 100px;
          left: 48%;
          transform: translateX(-50%);
          width: 150px;
        }
        .main-hat {
          top: -15px;
          left: 50%;
          transform: translateX(-50%);
          width: 200px;
        }

        /* 답변 버튼 */
        .button-wrapper {
          display: flex;
          justify-content: center;
        }
        .answer-btn {
          background: #518000;
          color: white;
          padding: 12px 24px;
          border-radius: 9999px;
          border: none;
          cursor: pointer;
          font-size: 16px;
          font-weight: 600;
        }
      `}</style>
    </div>
  );
};

export default MainPage;
