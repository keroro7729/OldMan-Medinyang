import React, { useEffect, useState } from "react";
import logo from "../../assets/logo.png";

const Greeting = () => {
  const [userName, setUserName] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem("currentUser");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (parsed.name) {
          setUserName(parsed.name);
        }
      } catch (e) {
        console.error("currentUser 파싱 오류:", e);
      }
    }
  }, []);

  const isUserMissing = userName === null;

  return (
    <div style={styles.container}>
      <img src={logo} alt="Medi냥 로고" style={styles.logo} />
      <div style={styles.inner}>
        <div style={styles.textWrapper}>
          {isUserMissing ? (
            <>
              <p style={styles.name}>등록된 유저가 없습니다.</p>
              <p style={styles.sub}>좌측 상단에서 유저를 추가해주세요.</p>
            </>
          ) : (
            <>
              <p style={styles.name}>{userName} 님,</p>
              <p style={styles.sub}>메디냥과 함께<br />더 건강한 생활 해보아요!</p>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
   background: "linear-gradient(to bottom, #2C7EDB 15%, #4EA0F1 70%, #ffffff 100%)",
    padding: "100px 24px 70px",
    color: "white",
    position: "flex",
  },
  logo: {
    position: "absolute",
    top: "30px",
    right: "20px",
    height: "50px",
    zIndex: 1,
    filter: "brightness(0) invert(1)",
    opacity: 0.60,
  },
  inner: {
    display: "flex",
    alignItems: "center",
    //gap: "20px",
  },
  textWrapper: {
    flex: 1,
  },
  name: {
    fontSize: "20px",
    fontWeight: "bold",
    marginBottom: "4px",
  },
  sub: {
    fontSize: "15px",
    lineHeight: "1.4",
  },
};

export default Greeting;
