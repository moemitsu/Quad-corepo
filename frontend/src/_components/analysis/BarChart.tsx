// src/_components/BarChart.tsx
'use client'
import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface BarChartProps {
  data: any;
  options?: any;
}

const BarChart: React.FC<BarChartProps> = ({ data, options }) => {
  if (!data || !data.datasets) return <div>Loading...</div>;

  const chartOptions = {
    ...options,
    plugins: {
      legend: {
        display: true,
        position: 'bottom', // 凡例の位置を設定
        labels: {
          font: {
            size: 16, // 凡例のフォントサイズを設定
          },
        },
      },
    },
  };

  return <Bar data={data} options={chartOptions} />;
};

export default BarChart;
