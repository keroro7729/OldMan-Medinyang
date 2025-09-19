// src/routes/PrivateRoute.jsx
import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const PrivateRoute = ({ children }) => {
  const { isLoggedIn, loading } = useAuth();

  if (loading) return null; // 로딩 중에는 아무것도 보여주지 않음
  return isLoggedIn ? children : <Navigate to="/" replace />;
};

export default PrivateRoute;
