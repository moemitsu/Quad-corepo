'use client';
import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ChartOptions } from 'chart.js';
import { BarChartData } from '../../types';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface BarChartProps {
  data: BarChartData;
  options?: ChartOptions<'bar'>;
}

const BarChart: React.FC<BarChartProps> = ({ data, options }) => {
  if (!data || !data.datasets) return <div>Loading...</div>;

  const defaultOptions: ChartOptions<'bar'> = {
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
          text: '時間',
          font: {
            size: 16,
          },
        },
        beginAtZero: true,
        suggestedMin: 1, // Minimum value to display on the y-axis
        suggestedMax: 6, // Maximum value to display on the y-axis
        ticks: {
          stepSize: 1, // Step size for y-axis ticks
        },
      },
    },
  };

  const chartOptions = { ...defaultOptions, ...options };

  return (
    <div style={{ width: '100%', overflowX: 'auto' }}>
      <div style={{ width: `${data.labels.length * 120}px`,height: '400px' }}>
        <Bar data={{ ...data }} options={chartOptions} />
      </div>
    </div>
  );
};

export default BarChart;
