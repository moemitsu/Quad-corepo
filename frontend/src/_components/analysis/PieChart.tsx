'use client'
import React from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { PieChartData } from '../../types/index'; // パスを適切に修正してください

ChartJS.register(ArcElement, Tooltip, Legend);

interface PieChartProps {
  data: PieChartData;
  options?: any;
}

const PieChart: React.FC<PieChartProps> = ({ data, options }) => {
  const chartOptions = {
    ...options,
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
      tooltip: {
        callbacks: {
          label: function(tooltipItem: any) {
            const value = tooltipItem.raw.toFixed(2);
            return `${tooltipItem.label}: ${value}%`;
          }
        }
      }
    },
  };

  return <Pie data={data} options={chartOptions} />;
};

export default PieChart;
