// src/components/common/ScrollAwareBottomNav.jsx
import React, { useEffect, useState } from "react";
import BottomNav from "../Main/BottomNav";

const ScrollAwareBottomNav = ({ current }) => {
  const [showNav, setShowNav] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(window.scrollY);

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      const currentY = window.scrollY;
      const delta = currentY - lastScrollY;

      if (!ticking) {
        window.requestAnimationFrame(() => {
          if (delta > 10) {
            setShowNav(false); // 아래로 많이 스크롤 → 숨김
          } else if (delta < -10) {
            setShowNav(true); // 위로 많이 스크롤 → 보임
          }
          setLastScrollY(currentY);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  return (
    <div
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        width: "100%",
        height: "64px",
        backgroundColor: "white",
        transform: showNav ? "translateY(0%)" : "translateY(100%)",
        transition: "transform 0.3s ease-in-out",
        zIndex: 1000,
      }}
    >
      <BottomNav current={current} />
    </div>
  );
};

export default ScrollAwareBottomNav;
