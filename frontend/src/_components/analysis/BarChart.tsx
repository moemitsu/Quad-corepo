// BarChart.tsx

import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { BarChartData, BarDataset } from '../../types';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface BarChartProps {
  data: BarChartData;
  options?: any;
}

const BarChart: React.FC<BarChartProps> = ({ data, options }) => {
  if (!data || !data.datasets) return <div>Loading...</div>;

  const chartOptions = {
    ...options,
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'bottom',
        labels: {
          font: {
            size: 16,
          },
        },
      },
    },
    scales: {
      x: {
        display: true,
        title: {
          display: true,
          text: '日付',
          font: {
            size: 16,
          },
        },
        ticks: {
          maxRotation: 0,
          minRotation: 0,
        },
      },
      y: {
        display: true,
        title: {
          display: true,
          text: '値',
          font: {
            size: 16,
          },
        },
      },
    },
  };

  return (
    <div style={{ width: '100%', overflowX: 'auto' }}>
      <div style={{ width: `${data.labels.length * 100}px` }}>
        <Bar data={{ ...data }} options={chartOptions} />
      </div>
    </div>
  );
};

export default BarChart;
