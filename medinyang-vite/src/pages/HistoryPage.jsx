// ✅ HistoryPage.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import HistoryList from "../components/History/HistoryList";
import TopHeader from "../components/TopHeader";
import BottomNav from "../components/BottomNav"; // ✅ 하단 네비게이션

// 한 페이지에 불러올 항목 수
const PAGE_SIZE = 10;

const HistoryPage = () => {
  const navigate = useNavigate();
  const today = new Date().toISOString().slice(0, 10);

  // 상태 관리
  const [allData, setAllData] = useState([]); // 전체 데이터
  const [historyData, setHistoryData] = useState([]); // 필터 적용 데이터
  const [filterType, setFilterType] = useState("전체");
  const [startDate, setStartDate] = useState("2023-01-01");
  const [endDate, setEndDate] = useState(today);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  // ✅ 더미 데이터 소스
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

  // ✅ 전체 더미 데이터 생성 (처음 로드 시)
  useEffect(() => {
    const dummy = Array.from({ length: 30 }, (_, i) => {
      const hospital = hospitals[Math.floor(Math.random() * hospitals.length)];
      const diagnosis = diagnoses[Math.floor(Math.random() * diagnoses.length)];
      const type = i % 2 === 0 ? "처방전" : "건강검진";
      const date = `2025-09-${String(i + 1).padStart(2, "0")}`;
      return { id: i + 1, hospital, type, diagnosis, date };
    });
    setAllData(dummy);
  }, []);

  // ✅ 필터 적용
  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      const filteredByDate = allData.filter(
        (item) => item.date >= startDate && item.date <= endDate
      );

      const filtered = filteredByDate.filter(
        (item) => filterType === "전체" || item.type === filterType
      );

      const startIdx = page * PAGE_SIZE;
      const endIdx = startIdx + PAGE_SIZE;
      setHistoryData(filtered.slice(startIdx, endIdx));
      setTotalPages(Math.ceil(filtered.length / PAGE_SIZE) || 1);
      setLoading(false);
    }, 300);
  }, [allData, page, startDate, endDate, filterType]);

  return (
    <div style={styles.wrapper}>
      <div style={styles.container}>
        {/* ✅ 상단 고정 영역 (헤더 + 필터) */}
        <div style={styles.fixedHeader}>
          <TopHeader title="의료 이력 관리" />

          <div style={styles.filterContainer}>
            <div style={styles.filters}>
              <label>
                시작일:
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => {
                    setPage(0);
                    setStartDate(e.target.value);
                  }}
                  style={styles.input}
                />
              </label>
              <label>
                종료일:
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => {
                    setPage(0);
                    setEndDate(e.target.value);
                  }}
                  style={styles.input}
                />
              </label>
              <select
                value={filterType}
                onChange={(e) => {
                  setPage(0);
                  setFilterType(e.target.value);
                }}
                style={{ ...styles.input, minWidth: "110px" }}
              >
                <option value="전체">전체</option>
                <option value="처방전">처방전</option>
                <option value="건강검진">건강검진</option>
              </select>
            </div>
          </div>
        </div>

        {/* ✅ 리스트 스크롤 영역 */}
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
              onClick={() => setPage((p) => p + 1)}
              disabled={page >= totalPages - 1}
              style={styles.pageButton}
            >
              다음
            </button>
          </div>
        </div>

        {/* ✅ 하단 네비게이션 (고정) */}
        <div style={styles.bottomNavWrapper}>
          <BottomNav current="upload" />
        </div>
      </div>
    </div>
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
    padding: "12px 20px",
  },
  filters: {
    display: "flex",
    flexWrap: "wrap",
    gap: "10px",
  },
  input: {
    marginLeft: "6px",
    padding: "6px 10px",
    borderRadius: "6px",
    border: "1px solid #ccc",
    backgroundColor: "#fff",
    fontSize: "14px",
  },
  scrollArea: {
    flex: 1,
    overflowY: "auto",
    padding: "16px 20px 80px", // ✅ 하단 네비 공간 확보
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
};

export default HistoryPage;
