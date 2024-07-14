'use client';
import React from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { PieChartData } from '../../types/index'; 
import { ChartOptions, TooltipItem } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

interface PieChartProps {
  data: PieChartData;
  options?: ChartOptions<'pie'>;
}

const PieChart: React.FC<PieChartProps> = ({ data, options }) => {
  const defaultOptions: ChartOptions<'pie'> = {
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
          label: function(tooltipItem: TooltipItem<'pie'>) {
            const value = tooltipItem.raw as number;
            return `${tooltipItem.label}: ${value.toFixed(2)}%`;
          }
        }
      }
    },
  };

  const chartOptions = {
    ...defaultOptions,
    ...options,
  };

  return (
   <Pie data={data} options={chartOptions} />
  )
};

export default PieChart;
