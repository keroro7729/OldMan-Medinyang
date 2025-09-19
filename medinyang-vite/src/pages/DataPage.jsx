import TopHeader from "../components/common/TopHeader";
import DataBasic from "../components/Data/DataBasic";
import DataReport from "../components/Data/DataReport";
import DataEdit from "../components/Data/DataEdit";
import ScrollAwareBottomNav from "../components/common/ScrollAwareBottomNav";

const DataPage = () => {
  return (
    <div style={styles.wrapper}>
      <div style={styles.container}>
        <TopHeader title="나의 건강 DATA" />
        <div style={styles.inner}>
          <DataBasic />
          <DataReport />
          <DataEdit />
        </div>
      </div>
      <ScrollAwareBottomNav current="data" />
    </div>
  );
};

const styles = {
  wrapper: {
   wrapper: {
    width: "100%",             // ✅ 100%로 변경
    minHeight: "100vh",
    overflowX: "hidden",       // ✅ 가로 스크롤 제거
    backgroundColor: "#f8f9fa",
    display: "flex",
    justifyContent: "center",
  },
  },
  container: {
    width: "100%",
    display: "flex",
    flexDirection: "column",
    backgroundColor: "#f8f9fa",
  },
  inner: {
    padding: "30px 20px",
    flex: 1,
    boxSizing: "border-box",
  },
};

export default DataPage;
