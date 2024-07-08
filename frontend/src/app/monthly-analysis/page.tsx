// src/_components/MonthlyAnalysis.tsx
'use client';
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation"; // useRouterをインポート
import BarChart from "../../_components/analysis/BarChart";
import PieChart from "../../_components/analysis/PieChart";
import OpenaiAnalysis from "../../_components/analysis/OpenaiAnalysis";
import Header from "../../_components/layout/Header";
import Footer from "../../_components/layout/Footer";
import { barData, pieData, colors } from "../../data";
import axios from "axios";
import { getAuth, onAuthStateChanged } from "firebase/auth"; // Firebaseのauthモジュールから必要な関数をインポート
import RecordList from "../../_components/analysis/RecordList"; // RecordListをインポート
const MonthlyAnalysis: React.FC = () => {
  const [barChartData, setBarChartData] = useState<any>({});
  const [pieChartData, setPieChartData] = useState<any>({});
  const [selectedYear, setSelectedYear] = useState<number>(2024); // 初期選択: 2024年
  const [selectedMonth, setSelectedMonth] = useState<number>(6); // 初期選択: 6月
  const [llmSummary, setLlmSummary] = useState<string>(""); // LLMの要約結果
  const [llmSentiment, setLlmSentiment] = useState<string>(""); // LLMのセンチメント
  const [children, setChildren] = useState<string[]>([]); // 子供のリスト
  const [selectedChild, setSelectedChild] = useState<string>(""); // 選択された子供

  const router = useRouter();

  useEffect(() => {
    fetchChildren();
  }, []);

  // FirebaseのAuthインスタンスを取得する
  const auth = getAuth();

  // ユーザーの認証状態が変更されたら、子供データを取得する
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        fetchChildren();
      }
    });

    return () => unsubscribe();
  }, [auth]);

  // 子供データの取得
  const fetchChildren = async () => {
    try {
      const bearerToken = await getAuthToken();
      const response = await axios.get('http://localhost:8000/api/v1/user/{user_id}/child_name', {
        headers: {
          Authorization: `Bearer ${bearerToken}`,
        },
      });
      setChildren(response.data.children);
    } catch (error) {
      console.error('Error fetching children:', error);
    }
  };

  // 月別の子供ごとのデータを取得する
  const fetchData = async () => {
    try {
      const bearerToken = await getAuthToken();
      const response = await axios.get('http://localhost:8000/api/v1/main', {
        params: {
          year: selectedYear,
          month: selectedMonth,
          child_name: selectedChild,
        },
        headers: {
          Authorization: `Bearer ${bearerToken}`,
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
  };

  useEffect(() => {
    if (selectedChild) {
      fetchData();
    }
  }, [selectedYear, selectedMonth, selectedChild]);

  // 認証トークンを取得する関数
  const getAuthToken = async () => {
    try {
      const user = auth.currentUser;
      if (user) {
        return await user.getIdToken(/* forceRefresh */ true);
      } else {
        throw new Error("User not logged in.");
      }
    } catch (error) {
      console.error("Error getting auth token:", error);
      throw error;
    }
  };

  return (
    <div>
      <Header />
      <div className="p-6  min-h-screen flex flex-col">
        <div className="mt-4 bg-white bg-opacity-50 p-6 rounded-lg shadow-md">
        分析条件を選択してください
          <div className="flex items-center justify-between mt-6">
          
            <div className="relative flex items-center space-x-4">
              
              <select
                className="p-4 text-xl text-custom-blue bg-custom-light-green shadow-inner"
                value={selectedYear}
                onChange={(e) => setSelectedYear(parseInt(e.target.value))}
              >
                {Array.from({ length: 1 }, (_, i) => (
                  <option key={selectedYear - i} value={selectedYear - i}>
                    {selectedYear - i}年
                  </option>
                ))}
              </select>
              <select
                className="p-4 text-xl text-custom-blue bg-custom-light-green shadow-inner"
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
                className="p-4 text-md text-custom-blue bg-custom-light-green shadow-inner"
                value={selectedChild}
                onChange={(e) => setSelectedChild(e.target.value)}
              >
                <option value="">お子様を選択</option>
                {children.map((child, index) => (
                  <option key={index} value={child}>
                    {child}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-center">
              <button
                className="p-2 bg-custom-teal text-md text-white rounded shadow-md hover:bg-custom-blue transition-colors"
                onClick={() => router.push("/record-activity")}
              >
                記録を追加
              </button>
            </div>
          </div>
        </div>
        <div className="mt-4 bg-white bg-opacity-50 p-6 rounded-lg shadow-md">
          <OpenaiAnalysis month={selectedMonth} />
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-custom-light-green bg-opacity-50 p-4 md:p-6 rounded-lg shadow-inner">
              <h3 className="text-xl text-custom-blue mb-2">家族との時間</h3>
              <PieChart data={pieChartData} />
            </div>
            <div className="bg-custom-light-green bg-opacity-50 p-4 md:p-6 rounded-lg shadow-inner">
              <h3 className="text-xl text-custom-blue mb-2">日別データ</h3>
              <BarChart data={barChartData} />
            </div>
          </div> 
        </div>
        <div className="mt-4 bg-white bg-opacity-50 p-6 rounded-lg shadow-md">
        <RecordList /> {/* ここにRecordListコンポーネントを追加 */}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default MonthlyAnalysis;
