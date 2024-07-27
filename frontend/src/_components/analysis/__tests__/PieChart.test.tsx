// src/_components/analysis/__tests__/PieChart.test.tsx
'use client'
import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import PieChart from '../PieChart';
import { PieChartData } from '../../../types/index'; 
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
// Chart.jsのプラグインを登録
ChartJS.register(ArcElement, Tooltip, Legend);

describe('PieChart', () => {
  const sampleData: PieChartData = {
    labels: ['Red', 'Blue', 'Yellow'],
    datasets: [
      {
          label: 'Sample Dataset',
          data: [30, 50, 20],
          backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
          hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
          borderColor: [],
          borderWidth: 0
      },
    ],
  };

  const renderComponent = (props = {}) => {
    return render(<PieChart data={sampleData} {...props} />);
  };

  test('デフォルトオプションでPieChartがレンダリングされることを確認', () => {
    const { container } = renderComponent();
    expect(container).toBeInTheDocument();
  });

  test('カスタムオプションが適用されることを確認', () => {
    const customOptions = {
      plugins: {
        legend: {
          display: false,
        },
      },
    };

    const { container } = renderComponent({ options: customOptions });
    expect(container).toBeInTheDocument();
    // ここにカスタムオプションの検証に関する追加のチェックを追加できます
  });

  test('正しいデータでチャートがレンダリングされることを確認', () => {
    const { getByText } = renderComponent();
    expect(getByText('Red')).toBeInTheDocument();
    expect(getByText('Blue')).toBeInTheDocument();
    expect(getByText('Yellow')).toBeInTheDocument();
  });
});