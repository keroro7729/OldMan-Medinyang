import React, { useState, useEffect, useRef } from "react";
import { FaUser } from "react-icons/fa";
import { LuChevronDown } from "react-icons/lu";

const UserSwitcher = () => {
  const [users, setUsers] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef(null);

  const fetchUsers = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/users`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "69420",
        },
        credentials: "include",
      });

      if (!res.ok) throw new Error("유저 목록 불러오기 실패");
      const data = await res.json();
      setUsers(data);
    } catch (err) {
      console.error("❌ 유저 목록 요청 실패:", err);
      alert("유저 정보를 불러오지 못했어요.");
    }
  };

  const switchUser = async (user) => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/users/switch/${user.userId}`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "ngrok-skip-browser-warning": "69420",
          },
        }
      );
      if (!res.ok) throw new Error("유저 전환 실패");

      localStorage.setItem("currentUser", JSON.stringify(user));
      window.location.href = "/main"; // 또는 window.location.reload();
    } catch (err) {
      console.error("❌ 유저 전환 실패:", err);
      alert("유저 전환 중 오류가 발생했습니다.");
    }
  };

  const deleteUser = async (userId) => {
    if (!window.confirm("정말 삭제하시겠습니까?")) return;
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/users/${userId}`,
        {
          method: "DELETE",
          headers: {
            "ngrok-skip-browser-warning": "69420",
          },
          credentials: "include",
        }
      );
      if (!res.ok) throw new Error("삭제 실패");
      setUsers(users.filter((user) => user.userId !== userId));
    } catch (err) {
      console.error("❌ 유저 삭제 실패:", err);
      alert("유저 삭제 중 오류 발생");
    }
  };

  const goToAddUserPage = () => {
    window.location.href = "/add-user";
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={wrapperRef} style={styles.wrapper}>
      <div onClick={() => setIsOpen(!isOpen)} style={styles.button}>
        <FaUser style={styles.icon} />
        <span>유저 전환</span>
        <LuChevronDown style={styles.icon} />
      </div>
      {isOpen && (
        <div style={styles.dropdown}>
          {users.length === 0 ? (
            <div style={styles.item}>&nbsp;&nbsp;등록된 유저가 없습니다.</div>
          ) : (
            users.map((user) => (
              <div key={user.userId} style={styles.userRow}>
                <button
                  style={styles.userButton}
                  onClick={() => switchUser(user)}
                >
                  {user.name} ({user.gender})
                </button>
                <button
                  style={styles.deleteButton}
                  onClick={() => deleteUser(user.userId)}
                >
                  ❌
                </button>
              </div>
            ))
          )}
          <div style={styles.addButtonWrapper}>
            <button style={styles.addButton} onClick={goToAddUserPage}>
              ➕ 유저 추가하기
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const styles = {
  wrapper: {
    position: "relative",
    padding: "10px 20px",
    zIndex: 1000,
    fontSize: "14px",
  },
  item: {
    fontSize: "14px",
  },
  button: {
    backgroundColor: "transparent",
    color: "white",
    fontWeight: "600",
    borderRadius: "6px",
    padding: "6px 4px",
    cursor: "pointer",
    fontSize: "14px",
    display: "flex",
    alignItems: "center",
    gap: "6px",
    border: "none",
  },
  icon: {
    fontSize: "14px",
  },
  dropdown: {
    position: "absolute",
    marginLeft: "20px",
    top: "calc(90% + 2px)",
    left: "0",
    backgroundColor: "#fff",
    border: "1px solid #ccc",
    borderRadius: "10px",
    padding: "8px 10px",
    width: "240px",
    boxShadow: "0 6px 12px rgba(0,0,0,0.1)",
    zIndex: 1000,
    backdropFilter: "blur(2px)",
    fontSize: "14px",
  },
  userRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: "8px",
    fontSize: "14px",
  },
  userButton: {
    flex: 1,
    padding: "6px",
    backgroundColor: "#f8f8f8",
    border: "1px solid #ccc",
    borderRadius: "6px",
    cursor: "pointer",
    textAlign: "left",
    fontSize: "14px",
  },
  deleteButton: {
    marginLeft: "8px",
    backgroundColor: "#ffdddd",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "14px",
  },
  addButtonWrapper: {
    marginTop: "12px",
    textAlign: "center",
    fontSize: "14px",
  },
  addButton: {
    padding: "8px",
    width: "100%",
    backgroundColor: "#e6f2ff",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "14px",
  },
};

export default UserSwitcher;
