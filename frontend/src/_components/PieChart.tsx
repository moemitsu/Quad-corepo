// src/_components/PieChart.tsx
'use client'
import React from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

interface PieChartProps {
  data: any;
  options?: any;
}

const PieChart: React.FC<PieChartProps> = ({ data, options }) => {
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

  return <Pie data={data} options={chartOptions} />;
};

export default PieChart;
