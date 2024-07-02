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
  return <Pie data={data} options={options} />;
};

export default PieChart;
