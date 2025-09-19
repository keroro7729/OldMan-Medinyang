import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const HealthTrendReport = () => {
  // 더미 체중 데이터 (최근 6개월)
  const weightData = [
    { date: '2023-11', weight: 65 },
    { date: '2023-12', weight: 64.2 },
    { date: '2024-01', weight: 63.5 },
    { date: '2024-02', weight: 63.0 },
    { date: '2024-03', weight: 62.8 },
    { date: '2024-04', weight: 62.5 }
  ];

  return (
    <div style={styles.card}>
      <h3>사용자 맞춤형 분석 리포트</h3>

      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={weightData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis unit="kg" />
          <Tooltip />
          <Line type="monotone" dataKey="weight" stroke="#8884d8" />
        </LineChart>
      </ResponsiveContainer>

      <div style={styles.aiReport}>
        <strong>AI 간단 리포트:</strong>
        <p>
          체중이 꾸준히 감소 중입니다. 이상적인 건강 상태를 유지하고 있습니다.
        </p>
      </div>
    </div>
  );
};

const styles = {
  card: {
    background: 'white',
    padding: '16px',
    borderRadius: '10px',
    marginBottom: '20px',
    boxShadow: '0 1px 4px rgba(0,0,0,0.1)'
  },
  aiReport: {
    marginTop: '10px',
    background: '#A7D8F0',
    padding: '10px',
    borderRadius: '8px'
  }
};

export default HealthTrendReport;
