// MonthlyAnalysis.tsx

"use client";
import React, { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import BarChart from "../../_components/analysis/BarChart";
import PieChart from "../../_components/analysis/PieChart";
import OpenaiAnalysis from "../../_components/analysis/OpenaiAnalysis";
import Header from "../../_components/layout/Header";
import Footer from "../../_components/layout/Footer";
import RecordList from "../../_components/analysis/RecordList";
import axios, { AxiosError } from "axios";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { BarDataset, PieChartData, BarChartData, colors } from "../../types";
import TotalHours from "@/_components/analysis/TotalHours";

// 名前からハッシュ値を生成する関数
const stringToHash = (str: string): number => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
    hash = hash & hash; // 32bit整数に変換
  }
  return hash;
};

// ハッシュ値から一意の色を生成する関数
const hashToColor = (hash: number): string => {
  const r = (hash & 0xff0000) >> 16;
  const g = (hash & 0x00ff00) >> 8;
  const b = hash & 0x0000ff;
  return `rgba(${r}, ${g}, ${b}, 0.5)`;
};

// 名前から一意の色を取得する関数
const nameToColor = (name: string): string => {
  const hash = stringToHash(name);
  return hashToColor(hash);
};

const MonthlyAnalysis: React.FC = () => {
  const [barChartData, setBarChartData] = useState<BarChartData | null>(null);
  const [pieChartData, setPieChartData] = useState<PieChartData | null>(null);
  const [selectedYear, setSelectedYear] = useState<number>(2024);
  const [selectedMonth, setSelectedMonth] = useState<number>(6);
  const [llmSummary, setLlmSummary] = useState<string | null>(null);
  const [children, setChildren] = useState<string[]>([]);
  const [selectedChildName, setSelectedChildName] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [authToken, setAuthToken] = useState<string>("");
  const router = useRouter();
  const auth = getAuth();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const token = await getAuthToken();
          console.log("tokenid", token);
          setAuthToken(token);
          fetchChildren(token);
        } catch (err) {
          console.error("Error fetching auth token:", err);
          setError("ユーザーが認証されていません。");
        }
      } else {
        setError("ユーザーが認証されていません。");
      }
    });

    return () => unsubscribe();
  }, [auth]);

  useEffect(() => {
    if (selectedChildName) {
      fetchData();
      fetchPieData();
    }
  }, [selectedYear, selectedMonth, selectedChildName]);

  const fetchChildren = async (token: string) => {
    try {
      const response = await axios.get<{ child_names: string[] }>(
        "http://localhost:8000/api/v1/names",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const childNames = response.data.child_names.filter(
        (name) => name !== ""
      );
      console.log("子供の名前", childNames);
      setChildren(childNames);
      setError(null);
    } catch (error: AxiosError | any) {
      console.error("Error fetching children:", error);
      setError("お子様の名前を取得できませんでした。");
    }
  };

  const fetchData = useCallback(async () => {
    try {
      const bearerToken = await getAuthToken();
      console.log("fetchData called with:", {
        year: selectedYear,
        month: selectedMonth,
        child_name: selectedChildName,
      });
      const response = await axios.get<any>(
        "http://localhost:8000/api/v1/bar-graph",
        {
          params: {
            year: selectedYear,
            month: selectedMonth,
            child_name: selectedChildName,
          },
          headers: {
            Authorization: `Bearer ${bearerToken}`,
          },
        }
      );

      const data = response.data;
      console.log("取得した生データ:", data);

      const familyMembers = Object.keys(data).filter(
        (key) => key !== "summary"
      );
      const dates = new Set<string>();
      familyMembers.forEach((member) => {
        Object.keys(data[member]).forEach((date) => {
          dates.add(date);
        });
      });

      const sortedDates = Array.from(dates).sort();

      // データセットの作成
      const datasets: BarDataset[] = familyMembers.map(
        (familyMember, index) => {
          const memberData = data[familyMember];
          const color = nameToColor(familyMember);
          return {
            label: familyMember,
            data: sortedDates.map((date) => memberData[date] || 0),
            backgroundColor: [color],
            borderColor: [color.replace("0.7", "1")],
            borderWidth: 1,
          };
        }
      );

      const barChartData: BarChartData = {
        labels: sortedDates,
        datasets,
        summary: data.summary,
      };

      console.log("取得した棒グラフデータ:", barChartData);
      setBarChartData(barChartData);
      setLlmSummary(data.summary);
      setError(null);
    } catch (error: AxiosError | any) {
      console.error("Error:", error);
      setError("データの取得に失敗しました。");
    }
  }, [selectedYear, selectedMonth, selectedChildName]);

  const fetchPieData = useCallback(async () => {
    try {
      const bearerToken = await getAuthToken();
      console.log("fetchPieData called with:", {
        year: selectedYear,
        month: selectedMonth,
        child_name: selectedChildName,
      });
      const response = await axios.get<any>(
        "http://localhost:8000/api/v1/pie-graph",
        {
          params: {
            year: selectedYear,
            month: selectedMonth,
            child_name: selectedChildName,
          },
          headers: {
            Authorization: `Bearer ${bearerToken}`,
          },
        }
      );

      const data = response.data;
      const labels = Object.keys(data);
      const values = Object.values(data) as number[];

      const pieChartData: PieChartData = {
        labels,
        datasets: [
          {
            label: "割合",
            data: values,
            backgroundColor: labels.map((label) => nameToColor(label)),
            borderColor: labels.map((label) =>
              nameToColor(label).replace("0.7", "1")
            ),
            borderWidth: 1,
          },
        ],
      };
      setPieChartData(pieChartData);
      console.log("取得した円グラフデータ:", pieChartData);
    } catch (error: AxiosError | any) {
      console.error("Error:", error);
      setError("データの取得に失敗しました。");
    }
  }, [selectedYear, selectedMonth, selectedChildName]);

  const getAuthToken = async (): Promise<string> => {
    const user = auth.currentUser;
    if (user) {
      return await user.getIdToken(true);
    } else {
      throw new Error("User not logged in.");
    }
  };

  return (
    <div>
      <Header />
      <div className="p-6 min-h-screen flex flex-col">
        <div className="mt-30 bg-white bg-opacity-50 p-6 rounded-lg shadow-md">
          分析したい月を選択してください
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
                value={selectedChildName}
                onChange={(e) => setSelectedChildName(e.target.value)}
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
        {error && (
          <div
            className="mt-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
            role="alert"
          >
            <strong className="font-bold">エラー:</strong>
            <span className="block sm:inline"> {error}</span>
          </div>
        )}
        <div className="mt-4 bg-white bg-opacity-50 p-6 rounded-lg shadow-md">
          <OpenaiAnalysis
            year={selectedYear}
            month={selectedMonth}
            selectedChildName={selectedChildName}
          />
        </div>
        <div className="mt-4 bg-white bg-opacity-50 p-6 rounded-lg shadow-md">
          <TotalHours
            selectedYear={selectedYear}
            selectedMonth={selectedMonth}
            selectedChildName={selectedChildName}
            bearerToken={authToken}
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-custom-light-green bg-opacity-50 p-4 md:p-6 rounded-lg shadow-inner">
              <h3 className="text-xl text-custom-blue mb-2">家族との時間</h3>
              {pieChartData ? (
                <PieChart data={pieChartData} />
              ) : (
                <div>Loading...</div>
              )}
              {error && <p>{error}</p>}
            </div>
            <div className="bg-custom-light-green bg-opacity-50 p-4 md:p-6 rounded-lg shadow-inner">
              <h3 className="text-xl text-custom-blue mb-2">日別データ</h3>
              <div className="overflow-x-auto">
                {barChartData ? (
                  <div
                    style={{
                      minWidth: "auto",
                      height: "auto",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "flex-end",
                    }}
                  >
                    <BarChart data={barChartData} />
                  </div>
                ) : (
                  <div>Loading...</div>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="mt-4 bg-white bg-opacity-50 p-6 rounded-lg shadow-md">
          <RecordList
            selectedYear={selectedYear}
            selectedMonth={selectedMonth}
            selectedChildName={selectedChildName}
            bearerToken={authToken}
          />
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default MonthlyAnalysis;
