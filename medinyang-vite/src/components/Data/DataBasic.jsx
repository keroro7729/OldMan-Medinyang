import React from 'react';
import { useNavigate } from 'react-router-dom';

const DataBasic = () => {
  const navigate = useNavigate();

  // 더미 정보 (조회용)
  const info = {
    이름: '홍길동',
    나이: 29,
    키: 173,
    몸무게: 65,
    성별: '남성',
    가족관계: '1인가구',
  };

  return (
    <div style={styles.card}>
      <h3>기본정보</h3>
      <div style={styles.grid}>
        <div style={styles.row}><strong>이름:</strong> {info.이름}</div>
        <div style={styles.row}><strong>나이:</strong> {info.나이}</div>
        <div style={styles.row}><strong>성별:</strong> {info.성별}</div>
        <div style={styles.row}><strong>키:</strong> {info.키}</div>
        <div style={styles.row}><strong>몸무게:</strong> {info.몸무게}</div>
        <div style={styles.row}><strong>가족관계:</strong> {info.가족관계}</div>
      </div>
      <button
        onClick={() => navigate('/edit-basic', { state: { from: '/data' } })}
        style={styles.button}
      >
        수정하기
      </button>
    </div>
  );
};

const styles = {
  card: {
    background: 'white',
    padding: '16px',
    borderRadius: '10px',
    marginBottom: '20px',
    boxShadow: '0 1px 4px rgba(0,0,0,0.1)',
  },
  row: {
    marginBottom: '8px',
  },
  button: {
    marginTop: '12px',
    padding: '8px 16px',
    backgroundColor: '#3B82F6',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
  },
};

export default DataBasic;
