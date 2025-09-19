import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowUp } from "@fortawesome/free-solid-svg-icons";

const ScrollToTopButton = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > 200);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (!visible) return null;

  return (
    <button
      onClick={scrollToTop}
      style={{
        position: "fixed",
        bottom: "90px",
        right: "20px",
        width: "44px",
        height: "44px",
        borderRadius: "22px",
        backgroundColor: "#3B82F6",
        color: "white",
        border: "none",
        boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
        cursor: "pointer",
        zIndex: 999,
        display: "flex",           // ✅ 가운데 정렬
        justifyContent: "center",
        alignItems: "center",
      }}
      aria-label="위로 가기"
    >
      <FontAwesomeIcon icon={faArrowUp} />
    </button>
  );
};

export default ScrollToTopButton;
