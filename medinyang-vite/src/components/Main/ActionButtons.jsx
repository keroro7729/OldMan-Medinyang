// ✅ 메디냥 메인 페이지의 주요 기능 버튼 컴포넌트
import React from "react";
import { useNavigate } from "react-router-dom";
import doctor from "../../assets/doctornyang.png"; // 메디냥 이미지
import camera from "../../assets/camera.png"; // 카메라 이미지
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCamera, faCommentDots } from "@fortawesome/free-solid-svg-icons"; // 아이콘

const ActionButtons = () => {
  const navigate = useNavigate(); // 페이지 이동용

  return (
    <div style={styles.wrapper}>
      {/* ✅ 의료 이미지 업로드 버튼 */}
      <div style={styles.buttonCard} onClick={() => navigate("/upload")}>
        <p style={styles.title}>
          <FontAwesomeIcon
            icon={faCamera}
            style={{ marginRight: "4px", color: "#3B82F6" }}
          />
          의료 이미지 업로드
        </p>
        <p style={styles.desc}>
          처방전이나 건강검진 결과를
          <br />
          메디냥에게 보내주세요!
        </p>
        <img
          src={camera}
          alt="카메라"
          style={{
            marginLeft: "auto",
            marginTop: "-20px",
            width: 75,
            height: 55,
            marginBottom: "-15px",
          }}
        />
      </div>

      {/* ✅ 메디냥 AI상담 버튼 */}
      <div style={styles.buttonCard} onClick={() => navigate("/chat")}>
        <p style={styles.title}>
          <FontAwesomeIcon
            icon={faCommentDots}
            style={{ marginRight: "4px", color: "#3B82F6" }}
          />
          메디냥 AI상담
        </p>
        <p style={styles.desc}>
          요즘 속이 안좋아요...
          <br />
          메디냥이랑 상담해보세요!
        </p>
        <img
          src={doctor}
          alt="메디냥"
          style={{
            marginLeft: "auto",
            marginTop: "-20px",
            width: 70,
            height: 80,
            marginBottom: "-15px",
          }}
        />
      </div>
    </div>
  );
};

// ✅ 스타일 정의
const styles = {
  wrapper: {
    display: "flex",
    justifyContent: "space-around",
    gap: "12px",
    marginTop: "-40px",
    padding: "0 16px",
    marginBottom: "20px",
  },
  buttonCard: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: "16px",
    padding: "16px",
    boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
    textAlign: "left",
    cursor: "pointer",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    gap: "12px",
    minHeight: "160px",
  },
  title: {
    fontSize: "12px",
    fontWeight: "bold",
    marginTop: "-2px",
  },
  desc: {
    fontSize: "12px",
    color: "#444",
    flexGrow: 1,
    fontWeight: "SemiBold",
    marginTop: "-10px",
  },
};

export default ActionButtons;
