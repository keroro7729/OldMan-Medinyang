import React, { useState } from "react";
import baseCat from "../assets/inventory-cat.png";
import bgImage from "../assets/inventory-bg.png";
import pajama from "../assets/items/pajama.png";
import greenT from "../assets/items/green-t.png";
import yellowCollar from "../assets/items/yellow-collar.png";
import sunglasses from "../assets/items/sunglasses.png";
import { useCat } from "../context/CatContext"; // ✅ context 가져오기

const InventoryModal = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState("전체");
  const { equipped, setEquipped } = useCat();

  // ✅ 임시 착용 상태 (닫을 때까지 context에 영향 없음)
  const [tempEquipped, setTempEquipped] = useState(equipped);

  const items = [
    { id: 1, name: "잠옷", type: "상의", cost: 25, img: pajama },
    { id: 2, name: "초록색 티", type: "상의", cost: 10, img: greenT },
    { id: 3, name: "노란색 카라티", type: "상의", cost: 12, img: yellowCollar },
    { id: 4, name: "선글라스", type: "악세사리", cost: 15, img: sunglasses },
  ];

  const filteredItems =
    activeTab === "전체"
      ? items
      : items.filter((item) => item.type === activeTab);

  // ✅ 아이템 착용/해제 (임시)
  const handleEquip = (item) => {
    setTempEquipped((prev) => ({
      ...prev,
      [item.type]: prev[item.type]?.id === item.id ? null : item,
    }));
  };

  // ✅ 적용 버튼 → context 반영
  const handleApply = () => {
    setEquipped(tempEquipped);
    onClose(); // 닫기
  };

  return (
    <div className="modal-overlay">
      <div className="modal-box" style={{ backgroundImage: `url(${bgImage})` }}>
        {/* 닫기 버튼 */}
        <button className="close-btn" onClick={onClose}>
          ✖
        </button>

        {/* 고양이 + 착용 아이템 */}
        <img src={baseCat} alt="고양이" className="cat-img" />
        {tempEquipped["상의"] && (
          <img
            src={tempEquipped["상의"].img}
            alt="상의"
            className="equip-img top-clothes"
          />
        )}
        {tempEquipped["악세사리"] && (
          <img
            src={tempEquipped["악세사리"].img}
            alt="악세사리"
            className="equip-img accessory"
          />
        )}
        {tempEquipped["모자"] && (
          <img
            src={tempEquipped["모자"].img}
            alt="모자"
            className="equip-img hat"
          />
        )}

        {/* 탭 */}
        <div className="tab-container">
          {["전체", "상의", "악세사리", "모자"].map((tab) => (
            <button
              key={tab}
              className={`tab-btn ${activeTab === tab ? "active" : ""}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* 아이템 목록 */}
        <div className="items-grid">
          {filteredItems.map((item) => {
            const isEquipped = tempEquipped[item.type]?.id === item.id;
            return (
              <div
                key={item.id}
                className={`item-card ${isEquipped ? "equipped" : ""}`}
                onClick={() => handleEquip(item)}
              >
                <img src={item.img} alt={item.name} className="item-img" />
                <p>{item.name}</p>
                <p className="cost">🐾 {item.cost}</p>
              </div>
            );
          })}
        </div>

        {/* ✅ 적용 버튼 */}
        <button className="apply-btn" onClick={handleApply}>
          적용하기
        </button>
      </div>

      {/* ✅ CSS */}
      <style>{`
        .modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.5);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 50;
        }
        .modal-box {
          width: 360px;
          height: 580px;
          border-radius: 20px;
          background-size: cover;
          background-position: center;
          padding: 16px;
          display: flex;
          flex-direction: column;
          align-items: center;
          position: relative; /* 아이템 absolute 정렬용 */
        }
        .close-btn {
          position: absolute;
          top: 12px;
          right: 12px;
          background: none;
          border: none;
          font-size: 20px;
          cursor: pointer;
        }
        .cat-img { 
          width: 250px; 
          height: auto; 
          display: block; 
          margin: 10px auto 12px; 
        }
        .equip-img { 
          position: absolute; 
          pointer-events: none; 
        }
        .top-clothes {
          top: 132px; left: 49.5%; transform: translateX(-50%);
          width: 75px;
        }
        .accessory {
          top: 82px; left: 49.4%; transform: translateX(-50%);
          width: 87px;
        }
        .hat {
          top: 15px; left: 50%; transform: translateX(-50%);
          width: 200px;
        }
        .tab-container { display: flex; gap: 8px; margin: 1px 0; }
        .tab-btn {
          padding: 6px 12px;
          border-radius: 20px;
          border: 1px solid #ccc;
          background: white;
          font-size: 14px;
          cursor: pointer;
        }
        .tab-btn.active { background: #518000; color: white; font-weight: 600; }
        .items-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 8px;
          margin-top: 10px;
          flex: 1;
        }
        .item-card {
          background: white;
          border-radius: 10px;
          padding: 6px;
          text-align: center;
          font-size: 12px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          cursor: pointer;
        }
        .item-card.equipped { border: 2px solid #518000; }
        .item-img { width: 40px; height: 40px; object-fit: contain; }
        .cost { font-size: 11px; color: #555; }
        .apply-btn {
          margin-top: 10px;
          padding: 8px 18px;
          border: none;
          border-radius: 20px;
          background: #518000;
          color: white;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
        }
        .apply-btn:hover { background: #3b5f00; }
      `}</style>
    </div>
  );
};

export default InventoryModal;
