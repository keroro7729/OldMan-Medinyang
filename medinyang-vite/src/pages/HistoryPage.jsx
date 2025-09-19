// ✅ HistoryPage.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import HistoryList from "../components/History/HistoryList";
import TopHeader from "../components/TopHeader";
import BottomNav from "../components/BottomNav";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendarAlt } from "@fortawesome/free-solid-svg-icons";

const PAGE_SIZE = 10;

const HistoryPage = () => {
  const navigate = useNavigate();
  const today = new Date().toISOString().slice(0, 10);

  // 상태
  const [allData, setAllData] = useState([]);
  const [historyData, setHistoryData] = useState([]);
  const [filterType, setFilterType] = useState("전체");
  const [startDate, setStartDate] = useState("2023-01-01");
  const [endDate, setEndDate] = useState(today);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  // 더미 데이터
  const hospitals = [
    "춘천세브란스병원",
    "강원대학교병원",
    "서울아산병원",
    "메디냥병원",
    "분당서울대병원",
  ];
  const diagnoses = [
    "혈압 관리 처방",
    "종합검진 결과: 이상 없음",
    "혈액검사 결과: 빈혈 소견",
    "X-ray 검사: 정상",
    "간 기능 검사: 주의 필요",
    "콜레스테롤 수치 관리 필요",
    "소화기 검진: 약간의 염증",
  ];

  useEffect(() => {
    const dummy = Array.from({ length: 30 }, (_, i) => {
      const hospital = hospitals[Math.floor(Math.random() * hospitals.length)];
      const diagnosis = diagnoses[Math.floor(Math.random() * diagnoses.length)];
      const type = i % 2 === 0 ? "처방전" : "건강검진";
      const date = `2025-09-${String(i + 1).padStart(2, "0")}`;
      return { id: i + 1, hospital, type, diagnosis, date };
    });
    setAllData(dummy);
  }, []); // 최초 1회

  // 날짜 역전되면 자동 보정
  useEffect(() => {
    if (startDate > endDate) {
      setStartDate(endDate);
      setPage(0);
    }
  }, [startDate, endDate]);

  // 필터/페이지 계산
  useEffect(() => {
    setLoading(true);
    const t = setTimeout(() => {
      const filteredByDate = allData.filter(
        (item) => item.date >= startDate && item.date <= endDate
      );
      const filtered =
        filterType === "전체"
          ? filteredByDate
          : filteredByDate.filter((item) => item.type === filterType);

      const pages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
      setTotalPages(pages);

      const safePage = Math.min(page, pages - 1);
      if (safePage !== page) {
        setPage(safePage);
      }

      const startIdx = safePage * PAGE_SIZE;
      const endIdx = startIdx + PAGE_SIZE;
      setHistoryData(filtered.slice(startIdx, endIdx));
      setLoading(false);
    }, 200);
    return () => clearTimeout(t);
  }, [allData, page, startDate, endDate, filterType]);

  return (
    <>
      {/* 전역 아이콘 겹침 방지: 네이티브 date 아이콘 숨김 */}
      <style>{`
        input.date-no-native-icon::-webkit-calendar-picker-indicator { opacity:0; display:none; }
        input.date-no-native-icon { -webkit-appearance:none; appearance:none; background:#fff; }
      `}</style>

      <div style={styles.wrapper}>
        <div style={styles.container}>
          {/* 상단 고정 영역 */}
          <div style={styles.fixedHeader}>
            <TopHeader title="의료 이력 관리" />

            <div style={styles.filterContainer}>
              <div style={styles.filters}>
                {/* 타입 선택 */}
                <select
                  value={filterType}
                  onChange={(e) => {
                    setPage(0);
                    setFilterType(e.target.value);
                  }}
                  style={styles.select}
                >
                  <option value="전체">전체</option>
                  <option value="처방전">처방전</option>
                  <option value="건강검진">건강검진</option>
                </select>

                {/* 시작일 */}
                <div style={styles.dateField}>
                  <input
                    className="date-no-native-icon"
                    type="date"
                    value={startDate}
                    onChange={(e) => {
                      setPage(0);
                      setStartDate(e.target.value);
                    }}
                    style={styles.dateInput}
                    aria-label="시작일"
                  />
                  <FontAwesomeIcon icon={faCalendarAlt} style={styles.dateIcon} />
                </div>

                {/* 종료일 */}
                <div style={styles.dateField}>
                  <input
                    className="date-no-native-icon"
                    type="date"
                    value={endDate}
                    onChange={(e) => {
                      setPage(0);
                      setEndDate(e.target.value);
                    }}
                    style={styles.dateInput}
                    aria-label="종료일"
                  />
                  <FontAwesomeIcon icon={faCalendarAlt} style={styles.dateIcon} />
                </div>
              </div>
            </div>
          </div>

          {/* 리스트 스크롤 영역 */}
          <div style={styles.scrollArea}>
            {loading ? (
              <p>불러오는 중입니다...</p>
            ) : historyData.length === 0 ? (
              <p>조회된 이력이 없습니다.</p>
            ) : (
              <HistoryList
                data={historyData}
                onItemClick={(id) => navigate(`/history/${id}`)}
              />
            )}

            {/* 페이지네이션 */}
            <div style={styles.pagination}>
              <button
                onClick={() => setPage((p) => Math.max(0, p - 1))}
                disabled={page === 0}
                style={styles.pageButton}
              >
                이전
              </button>
              <span style={{ margin: "0 12px" }}>
                {page + 1} / {totalPages}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
                disabled={page >= totalPages - 1}
                style={styles.pageButton}
              >
                다음
              </button>
            </div>
          </div>

          {/* ✅ 업로드 버튼 (하단 고정) */}
          <div style={styles.uploadButtonWrapper}>
            <button
              style={styles.uploadButton}
              onClick={() => navigate("/upload")}
            >
              의료 기록 업로드 하기
            </button>
          </div>

          {/* 하단 네비 */}
          <div style={styles.bottomNavWrapper}>
            <BottomNav current="history" />
          </div>
        </div>
      </div>
    </>
  );
};

const styles = {
  wrapper: {
    display: "flex",
    justifyContent: "center",
    width: "100%",
    minHeight: "100vh",
    backgroundColor: "#D1E3FF",
  },
  container: {
    position: "relative",
    maxWidth: "430px",
    width: "100%",
    minHeight: "100vh",
    backgroundColor: "#f5f5f5",
    display: "flex",
    flexDirection: "column",
  },
  fixedHeader: {
    position: "sticky",
    top: 0,
    zIndex: 20,
    backgroundColor: "#f5f5f5",
    borderBottom: "1px solid #e0e0e0",
  },
  filterContainer: {
    padding: "12px 16px",
  },
  // ✅ 항상 한 줄: [전체][시작일][종료일]
  filters: {
    display: "grid",
    gridTemplateColumns: "96px minmax(0,1fr) minmax(0,1fr)",
    columnGap: "8px",
    alignItems: "center",
  },
  // select 고정 폭
  select: {
    width: "96px",
    padding: "6px 10px",
    borderRadius: "6px",
    border: "1px solid #ccc",
    fontSize: "14px",
    backgroundColor: "#fff",
  },
  // 날짜 필드(커스텀 아이콘 1개만 보이게)
  dateField: {
    position: "relative",
    width: "100%",
    height: "31px",
  },
  dateInput: {
    width: "100%",
    height: "100%",
    padding: "0 34px 0 12px", // 아이콘 자리 확보
    border: "1px solid #ccc",
    borderRadius: "8px",
    fontSize: "14px",
    backgroundColor: "#fff",
    boxSizing: "border-box",
  },
  dateIcon: {
    position: "absolute",
    right: "10px",
    top: "50%",
    transform: "translateY(-50%)",
    fontSize: "14px",
    color: "#3B82F6",
    pointerEvents: "none",
  },
  scrollArea: {
    flex: 1,
    overflowY: "auto",
    padding: "16px 20px 80px",
  },
  pagination: {
    marginTop: "20px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: "20px",
  },
  pageButton: {
    padding: "6px 14px",
    fontSize: "14px",
    backgroundColor: "#3B82F6",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
  },
  bottomNavWrapper: {
    position: "fixed",
    bottom: 0,
    left: "50%",
    transform: "translateX(-50%)",
    width: "100%",
    maxWidth: "430px",
    zIndex: 30,
  },
  uploadButtonWrapper: {
    position: "fixed",
    bottom: 70,               // 네비게이션 위로 띄우기
    left: "50%",
    transform: "translateX(-50%)",
    width: "100%",
    maxWidth: "430px",
    display: "flex",
    justifyContent: "center",
    zIndex: 40,
  },
  uploadButton: {
    width: "328px",
    height: "44px",
    backgroundColor: "#3B82F6",   // 파란색
    color: "#fff",
    border: "none",
    borderRadius: "22px",         // pill 모양
    fontSize: "15px",
    fontWeight: "600",
    cursor: "pointer",
    boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
  },

};

export default HistoryPage;
