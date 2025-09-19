// src/context/CatContext.jsx
import React, { createContext, useContext, useState } from "react";

// Context 생성
const CatContext = createContext();

// Provider 컴포넌트
export const CatProvider = ({ children }) => {
  const [equipped, setEquipped] = useState({
    상의: null,
    악세사리: null,
    모자: null,
  });

  return (
    <CatContext.Provider value={{ equipped, setEquipped }}>
      {children}
    </CatContext.Provider>
  );
};

// ✅ useCat 훅 export
export const useCat = () => {
  const context = useContext(CatContext);
  if (!context) {
    throw new Error("useCat은 CatProvider 안에서만 사용해야 합니다.");
  }
  return context;
};
