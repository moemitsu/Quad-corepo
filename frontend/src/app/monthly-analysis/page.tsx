// MonthlyAnalysis.tsx
'use client'
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation"; // useRouterフックをインポート
import BarChart from "../../_components/BarChart";
import PieChart from "../../_components/PieChart";
import OpenaiAnalysis from "../../_components/OpenaiAnalysis";
import { barData, pieData, colors } from "../../data";

const MonthlyAnalysis: React.FC = () => {
  const [barChartData, setBarChartData] = useState<any>({});
  const [pieChartData, setPieChartData] = useState<any>({});
  const [selectedMonth, setSelectedMonth] = useState<number>(6); // 初期選択: 6月
  const [llmSummary, setLlmSummary] = useState<string>(""); // LLMの要約結果
  const [llmSentiment, setLlmSentiment] = useState<string>(""); // LLMのセンチメント

  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`http://localhost:8000/api/v1/main?month=2024-${selectedMonth}&child_name=Child One`);
        if (!response.ok) {
          throw new Error('データの取得に失敗しました。');
        }
        const data = await response.json();
        const { summary, analysis } = data;

        // グラフデータに色を追加する関数
        const addColors = (data: any, isPieChart = false) => {
          const newData = { ...data };
          newData.datasets = newData.datasets.map((dataset: any, index: number) => {
            if (isPieChart) {
              const backgroundColor = dataset.data.map(
                (_: any, i: number) => colors[i % colors.length]
              );
              const borderColor = backgroundColor.map((color: string) =>
                color.replace("0.7", "1")
              );
              return {
                ...dataset,
                backgroundColor,
                borderColor,
                borderWidth: 2,
              };
            } else {
              const color = colors[index % colors.length];
              return {
                ...dataset,
                backgroundColor: color,
                borderColor: color.replace("0.7", "1"),
                borderWidth: 1,
              };
            }
          });
          return newData;
        };

        setBarChartData(addColors(barData));
        setPieChartData(addColors(pieData, true));
        setLlmSummary(analysis.llm_summary);
        setLlmSentiment(analysis.llm_sentiment);
      } catch (error) {
        console.error('エラー:', error);
      }
    };

    fetchData();
  }, [selectedMonth]);

  return (
    <div className="p-6 bg-custom-light-green min-h-screen flex flex-col">
      <div className="flex items-center justify-between">
        <h1 className="text-7xl text-custom-blue">
          <img src="/corepo.png" alt="LLM Icon" className="w-30 h-41" />
        </h1>
        <button
          className="p-4 bg-custom-blue text-xl text-white rounded shadow-md hover:bg-custom-blue-dark transition-colors"
        >
          登録情報
        </button>
      </div>
      <div className="mt-4 bg-white p-6 rounded-lg shadow-md">
        <div className="flex items-center justify-between mt-12">
          <div className="relative">
            <select
              className="p-4 text-4xl text-custom-blue bg-custom-light-green"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
            >
              {Array.from({ length: 12 }, (_, i) => (
                <option key={i + 1} value={i + 1}>
                  {i + 1}月
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-white">
              <svg
                className="fill-current h-4 w-4 mt-2 mr-2"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M7.293 11.293a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414l-3.5-3.5a1 1 0 010-1.414l3.5-3.5a1 1 0 111.414 1.414l-4 4-4-4a1 1 0 010-1.414l3.5-3.5a1 1 0 111.414 1.414l-3.5 3.5a1 1 0 010 1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </div>

            <button
              className="p-4 bg-custom-teal text-xl text-white rounded shadow-md hover:bg-custom-teal-dark transition-colors"
              onClick={() => router.push("/record-activity")}
            >
              記録を追加+
            </button>
          </div>
          {/* FIXME：フェッチできたら表示トライする */}
             {/* <OpenaiAnalysis month={selectedMonth} /> */}
        </div>
      </div>

      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
        
        <div className="bg-custom-light-green p-4 md:p-6 rounded-lg">
          <h3 className="text-3xl font-custom-blue mb-2">割合で比較</h3>
          <PieChart data={pieChartData} />
        </div>
        <div className="bg-custom-light-green p-4 md:p-6 rounded-lg">
          <h3 className="text-3xl font-custom-blue mb-2">週間で見る</h3>
          <BarChart data={barChartData} />
        </div>
      </div>
    </div>
  );
};

export default MonthlyAnalysis;
