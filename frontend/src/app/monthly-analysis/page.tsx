'use client'
import React, { useEffect, useState } from 'react';
import BarChart from '../../_components/BarChart';
import PieChart from '../../_components/PieChart';

const MonthlyAnalysis: React.FC = () => {
  const [barChartData, setBarChartData] = useState<any>({});
  const [pieChartData, setPieChartData] = useState<any>({});

  useEffect(() => {
    // APIからデータをフェッチするか、ここでデータを設定します
    const fetchData = async () => {
      // ダミーデータ
      const barData = {
        labels: ['日付1', '日付2', '日付3', '日付4'],
        datasets: [
          {
            label: '母',
            data: [6, 8, 7, 5],
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1,
          },
          {
            label: '父',
            data: [4, 3, 5, 4],
            backgroundColor: 'rgba(153, 102, 255, 0.2)',
            borderColor: 'rgba(153, 102, 255, 1)',
            borderWidth: 1,
          },
          {
            label: '祖父母',
            data: [2, 1, 3, 2],
            backgroundColor: 'rgba(255, 159, 64, 0.2)',
            borderColor: 'rgba(255, 159, 64, 1)',
            borderWidth: 1,
          },
        ],
      };

      const pieData = {
        labels: ['母', '父', '祖父母'],
        datasets: [
          {
            label: '割合',
            data: [70, 20, 10],
            backgroundColor: [
              'rgba(75, 192, 192, 0.2)',
              'rgba(153, 102, 255, 0.2)',
              'rgba(255, 159, 64, 0.2)',
            ],
            borderColor: [
              'rgba(75, 192, 192, 1)',
              'rgba(153, 102, 255, 1)',
              'rgba(255, 159, 64, 1)',
            ],
            borderWidth: 1,
          },
        ],
      };

      setBarChartData(barData);
      setPieChartData(pieData);
    };

    fetchData();
  }, []);

  return (
    <div className="p-6 bg-custom-green min-h-screen flex flex-col">
      <div className="flex items-center justify-between">
        <h1 className="text-7xl text-custom-blue">corepo</h1>
        <button className="p-4 bg-custom-blue text-white rounded">登録情報</button>
      </div>
      <div className="flex items-center justify-between mt-12">
        <h2 className="text-4xl font-bold">6月</h2>
        <button className="p-2 bg-custom-teal text-white rounded">記録を追加+</button>
      </div>
      <div className="mt-4 bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold mb-2">LLMでの分析結果</h3>
        <p>LLMでの分析結果がここに入ります</p>
      </div>
      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white p-4 md:p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-2">割合比較</h3>
          <PieChart data={pieChartData} />
        </div>
        <div className="bg-white p-4 md:p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-2">週間</h3>
          <BarChart data={barChartData} />
        </div>
      </div>
    </div>
  );
};

export default MonthlyAnalysis;
