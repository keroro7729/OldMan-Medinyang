import React from 'react';

const DataEditButton = () => {
  const handleClick = () => {
    alert('건강데이터 열람 및 수정 페이지로 이동합니다!');
    // ex: navigate('/edit-health') 도 가능
  };

  return (
    <div style={{ textAlign: 'center' }}>
      <button style={styles.button} onClick={handleClick}>
        건강데이터 열람 및 수정
      </button>
    </div>
  );
};

const styles = {
  button: {
    padding: '12px 24px',
    background: '#3B82F6',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '16px',
    cursor: 'pointer',
    marginBottom: "80px",
  }
};

export default DataEditButton;
