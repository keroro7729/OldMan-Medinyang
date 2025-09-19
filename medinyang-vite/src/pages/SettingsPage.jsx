import TopHeader from "../components/common/TopHeader";
import SettingSection from "../components/Settings/SettingSection";
import ScrollAwareBottomNav from "../components/common/ScrollAwareBottomNav";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { logout } from "../api/auth";

const SettingsPage = () => {
  const navigate = useNavigate();
  const { setIsLoggedIn } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (e) {
      console.warn("서버 로그아웃 실패 – 클라이언트만 초기화합니다",e);
    }

    setIsLoggedIn(false);
    localStorage.removeItem("currentUser");
    localStorage.removeItem("users");
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("accessToken");

    navigate("/", { replace: true });
  };

  return (
    <div style={styles.page}>
      <TopHeader title="설정" />
      <div style={styles.container}>
        <SettingSection
          title="계정 관리"
          items={[
            { label: "로그아웃", onClick: handleLogout },
            "계정 정보(이메일, 닉네임 등)",
            "탈퇴하기",
          ]}
        />
        <SettingSection title="앱 정보" items={["버전 정보", "업데이트 확인"]} />
        <SettingSection title="약관 및 정책" items={["이용 약관", "개인정보 처리 방침"]} />
        <SettingSection title="문의 및 피드백" items={["고객센터", "피드백 보내기"]} />
      </div>
      <ScrollAwareBottomNav current="setting" />
    </div>
  );
};

const styles = {
  page: {
    backgroundColor: "#f9f9f9",
    minHeight: "100vh",
    width: "100vw",
    margin: "0 auto",
  },
  container: {
    padding: "16px",
    display: "flex",
    flexDirection: "column",
    gap: "16px",
  },
};

export default SettingsPage;
