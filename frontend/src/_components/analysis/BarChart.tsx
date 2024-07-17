"use client";
import React from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions,
} from "chart.js";
import { BarChartData } from "../../types";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface BarChartProps {
  data: BarChartData;
  options?: ChartOptions<"bar">;
}

// 日付順に並び替える関数
const sortDataByDate = (data: BarChartData): BarChartData => {
  const sortedData = { ...data };
  sortedData.labels = [...data.labels].sort((a, b) => new Date(a).getTime() - new Date(b).getTime());
  sortedData.datasets = data.datasets.map(dataset => {
    const sortedDataset = { ...dataset };
    sortedDataset.data = sortedData.labels.map(label => {
      const index = data.labels.indexOf(label);
      return dataset.data[index];
    });
    return sortedDataset;
  });
  return sortedData;
};

// 棒グラフのx,y軸の設定
const BarChart: React.FC<BarChartProps> = ({ data, options }) => {
  if (!data || !data.datasets) return <div>Loading...</div>;

  const sortedData = sortDataByDate(data);

  const defaultOptions: ChartOptions<"bar"> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: "bottom",
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
          text: "日付",
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
          text: "時間",
          font: {
            size: 16,
          },
        },
        beginAtZero: true,
        suggestedMin: 1,
        suggestedMax: 'undefined',// 最大値を自動で設定
        ticks: {
          stepSize: 1,
        },
      },
    },
  };

  const chartOptions = { ...defaultOptions, ...options };

  return (
    <div style={{ width: "100%", height: "100%" }}>
      <div style={{ width: "100%", height: "50vh" }}>
        <Bar data={sortedData} options={chartOptions} />
      </div>
    </div>
  );
};

export default BarChart;
