"use client";
import React, { useCallback, useEffect, useState } from 'react';
import axios, { AxiosError } from 'axios';
import BarChart from "../../_components/analysis/BarChart";
import PieChart from "../../_components/analysis/PieChart";
import { BarChartData, BarDataset, PieChartData } from '@/types';
import TotalHours from './TotalHours';

interface UnifyChartProps {
  selectedYear: number;
  selectedMonth: number;
  selectedChildName: string;
  authToken: string;
}

const stringToHash = (str: string): number => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
    hash = hash & hash;
  }
  return hash;
};

const hashToColor = (hash: number): string => {
  const r = (hash & 0xff0000) >> 16;
  const g = (hash & 0x00ff00) >> 8;
  const b = hash & 0x0000ff;
  return `rgba(${r}, ${g}, ${b}, 0.5)`;
};

const nameToColor = (name: string): string => {
  const hash = stringToHash(name);
  return hashToColor(hash);
};

const UnifyChart: React.FC<UnifyChartProps> = ({
  selectedYear,
  selectedMonth,
  selectedChildName,
  authToken,
}) => {
  const [barChartData, setBarChartData] = useState<BarChartData | null>(null);
  const [pieChartData, setPieChartData] = useState<PieChartData | null>(null);
  const [llmSummary, setLlmSummary] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      const bearerToken = authToken || "";
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

      const datasets: BarDataset[] = familyMembers.map((familyMember) => {
        const memberData = data[familyMember];
        const color = nameToColor(familyMember);
        return {
          label: familyMember,
          data: sortedDates.map((date) => memberData[date] || 0),
          backgroundColor: [color],
          borderColor: [color.replace("0.7", "1")],
          borderWidth: 1,
        };
      });

      const barChartData: BarChartData = {
        labels: sortedDates,
        datasets,
        summary: data.summary,
      };

      setBarChartData(barChartData);
      setLlmSummary(data.summary);
      setError(null);
    } catch (error: AxiosError | any) {
      setError("データの取得に失敗しました。");
    }
  }, [selectedYear, selectedMonth, selectedChildName, authToken]);

  const fetchPieData = useCallback(async () => {
    try {
      const bearerToken = authToken || "";
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
    } catch (error: AxiosError | any) {
      setError("データの取得に失敗しました。");
    }
  }, [selectedYear, selectedMonth, selectedChildName, authToken]);

  useEffect(() => {
    if (selectedChildName) {
      fetchData();
      fetchPieData();
    }
  }, [fetchData, fetchPieData, selectedChildName]);

  return (
    <div className="mt-4 bg-white bg-opacity-50 p-6 rounded-lg shadow-md">
      <TotalHours
        selectedYear={selectedYear}
        selectedMonth={selectedMonth}
        selectedChildName={selectedChildName}
        bearerToken={authToken}
      />
      {!selectedChildName ? (
        <div className="text-center text-dark-500">お子様を選択してください</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="md:col-span-1 bg-custom-light-green bg-opacity-50 p-4 md:p-6 rounded-lg shadow-inner">
            <h3 className="text-xl text-custom-blue font-semibold mb-2">家族との時間</h3>
            {pieChartData ? (
              <PieChart data={pieChartData} />
            ) : (
              <div>Loading...</div>
            )}
            {error && <p>{error}</p>}
          </div>
          <div className="md:col-span-2 bg-custom-light-green bg-opacity-50 p-4 md:p-6 rounded-lg shadow-inner">
            <h3 className="text-xl text-custom-blue font-semibold mb-2">日別データ</h3>
            <div className="overflow-x-auto">
              {barChartData ? (
                <div>
                  <BarChart data={barChartData} />
                </div>
              ) : (
                <div>Loading...</div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UnifyChart;
