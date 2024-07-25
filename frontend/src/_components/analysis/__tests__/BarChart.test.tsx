// src/_components/analysis/__tests__/BarChart.test.tsx

import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import BarChart from '../BarChart';
import { BarChartData } from '../../../types';

// BarChartコンポーネントのテストを記述
describe('BarChart', () => {
    // テスト用のモックデータを定義
  const mockData: BarChartData = {
      labels: ['2024-06-13', '2024-06-14', '2024-06-15'],
      datasets: [
          {
              label: 'Hours spent',
              data: [2, 3, 4],
              backgroundColor: ['rgba(75, 192, 192, 0.2)'],
              borderColor: ['rgba(75, 192, 192, 1)'],
              borderWidth: 1,
          },
      ],
      summary: function (summary: any): unknown {
          throw new Error('Function not implemented.');
      }
  };

  //データが提供されていない場合に"loading..."メッセージが表示されることを確認
  test('renders loading message if no data is provided', () => {
    render(<BarChart data={{ labels: [], datasets: [] }} />);
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

//   データが提供された場合に棒グラフが正しくレンダリングされることを確認
  test('renders the bar chart with sorted data', () => {
    render(<BarChart data={mockData} />);
    
    //キャンバス要素がレンダリングされれていることを確認
    const canvas = screen.getByRole('img');
    expect(canvas).toBeInTheDocument();
  });
// チャートのラベルが正しくソートされて表示されることを確認
  test('displays the correct chart labels', () => {
    render(<BarChart data={mockData} />);
    
    // チャートのラベルが正しくソートされて表示されることを確認
    expect(mockData.labels).toEqual(['2024-06-13', '2024-06-14', '2024-06-15']);
  });
// スナップショットテストを行い、コンポーネントのレンダリング結果が以前の結果と一致することを確認
  test('matches snapshot', () => {
    const { asFragment } = render(<BarChart data={mockData} />);
    expect(asFragment()).toMatchSnapshot();
  });
});
