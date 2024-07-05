// src/_components/MonthlyAnalysis.tsx
"use client";
import React, { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation"; // useRouterをインポート
import BarChart from "../../_components/BarChart";
import PieChart from "../../_components/PieChart";
import OpenaiAnalysis from "../../_components/OpenaiAnalysis";
import Header from "../../_components/layout/header";
import Footer from "../../_components/layout/footer";
import { barData, pieData, colors } from "../../data";
import axios from "axios";

const MonthlyAnalysis: React.FC = () => {
  const [barChartData, setBarChartData] = useState<any>({});
  const [pieChartData, setPieChartData] = useState<any>({});
  const [selectedMonth, setSelectedMonth] = useState<number>(6); // 初期選択: 6月
  const [llmSummary, setLlmSummary] = useState<string>(""); // LLMの要約結果
  const [llmSentiment, setLlmSentiment] = useState<string>(""); // LLMのセンチメント
  const [children, setChildren] = useState<string[]>([]); // 子供のリスト
  const [selectedChild, setSelectedChild] = useState<string>(""); // 選択された子供

  const router = useRouter();

  // 子供データの取得
  const fetchChildren = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/v1/children');
      setChildren(response.data.children);
    } catch (error) {
      console.error('Error fetching children:', error);
    }
  };

  // 月別の子供ごとのデータを取得する
  const fetchData = useCallback(async () => {
    try {
      const response = await axios.get(`http://localhost:8000/api/v1/main`, {
        params: {
          month: `2024-${selectedMonth}`,
          child_name: selectedChild,
        },
      });
      const data = response.data;
      const { summary, analysis } = data;

      // グラフデータに色を追加する関数
      const addColors = (data: any, isPieChart = false) => {
        const newData = { ...data };
        newData.datasets = newData.datasets.map(
          (dataset: any, index: number) => {
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
          }
        );
        return newData;
      };

      setBarChartData(addColors(barData));
      setPieChartData(addColors(pieData, true));
      setLlmSummary(analysis.llm_summary);
      setLlmSentiment(analysis.llm_sentiment);
    } catch (error) {
      console.error("エラー:", error);
    }
  },[selectedMonth, selectedChild]);

  useEffect(() => {
    fetchChildren();
  }, []);

  useEffect(() => {
    if (selectedChild) {
      fetchData();
    }
  }, [selectedMonth, selectedChild, fetchData]);

  return (
    <div>
      <Header />
      <div className="p-6 bg-custom-light-green min-h-screen flex flex-col">
        <div className="mt-4"></div>
        <div className="mt-4 bg-white bg-opacity-50 p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between mt-12">
            <div className="relative">
              <select
                className="p-4 text-2xl text-custom-blue bg-custom-light-green mt-4"
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
              >
                {Array.from({ length: 12 }, (_, i) => (
                  <option key={i + 1} value={i + 1}>
                    {i + 1}月
                  </option>
                ))}
              </select>
              <select
                className="p-4 text-2xl text-custom-blue bg-custom-light-green mt-4"
                value={selectedChild}
                onChange={(e) => setSelectedChild(e.target.value)}
              >
                <option value="">お子様を選択してください</option>
                {children.map((child, index) => (
                  <option key={index} value={child}>
                    {child}
                  </option>
                ))}
              </select>
              <button
                className="p-4 bg-custom-teal text-xl text-white rounded shadow-md hover:bg-custom-teal-dark transition-colors mt-4"
                onClick={() => router.push("/record-activity")}
              >
                記録を追加＋
              </button>
            </div>
            {/* FIXME：GETできたら表示トライする */}
            {/* <OpenaiAnalysis month={selectedMonth} /> */}
          </div>
        </div>
        <div className="mt-4 bg-white bg-opacity-50 p-6 rounded-lg shadow-md">
          <div className="flex justify-center space-x-4 mb-4">
            <button className="p-2 bg-custom-light-blue text-white rounded-md shadow-md hover:bg-custom-blue transition-colors">
              月別
            </button>
            <button className="p-2 bg-custom-light-blue text-white rounded-md shadow-md hover:bg-custom-blue transition-colors">
              週別
            </button>
            <button className="p-2 bg-custom-light-blue text-white rounded-md shadow-md hover:bg-custom-blue transition-colors">
              日別
            </button>
          </div>
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-custom-light-green bg-opacity-50 p-4 md:p-6 rounded-lg shadow-inner">
              <h3 className="text-3xl text-custom-blue mb-2">割合で比較</h3>
              <PieChart data={pieChartData} />
            </div>
            <div className="bg-custom-light-green bg-opacity-50 p-4 md:p-6 rounded-lg shadow-inner">
              <h3 className="text-3xl text-custom-blue mb-2">週間で見る</h3>
              <BarChart data={barChartData} />
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default MonthlyAnalysis;
