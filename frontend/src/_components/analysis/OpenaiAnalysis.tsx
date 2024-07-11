'use client'
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../../lib/firebase';

interface OpenaiAnalysisProps {
  month: number;
  selectedChildName: string;
}

interface AnalysisData {
  advice: string;
}

const OpenaiAnalysis: React.FC<OpenaiAnalysisProps> = ({ month, selectedChildName }) => {
  const [selectedYear, setSelectedYear] = useState<number>(2024);
  const [selectedMonth, setSelectedMonth] = useState<number>(6);
  const [selectedChild, setSelectedChild] = useState<string>("");

  const [user] = useAuthState(auth);
  const [data, setData] = useState<AnalysisData | null>(null);
  const [viewCount, setViewCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (user) {
        try {
          const token = await user.getIdToken();
          const response = await axios.get('http://localhost:8000/api/v1/analysis', {
            params: {
              year: selectedYear,
              month: selectedMonth,
              child_name: selectedChildName,
            },
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          setData(response.data);
        } catch (error) {
          console.error('データ取得に失敗しました', error);
          setError('データの取得に失敗しました');
        } finally {
          setLoading(false);
        }
      }
    };
    fetchData();
  }, [user, selectedYear, selectedMonth, selectedChild]);

  const handleViewClick = () => {
    setViewCount(viewCount + 1);
  };

  if (!user) {
    return <p>ログインしてください。</p>;
  }

  if (loading) {
    return <p>データを読み込んでいます...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  if (!data) {
    return <p>データを取得できませんでした。</p>;
  }

  return (
    <div className="flex mt-4 items-center justify-center">
      <div className="relative bg-white p-6 rounded-lg shadow-md self-start flex items-center">
        <div>
          <h3 className="text-2xl font-semibold mb-2">LLMでの分析</h3>
          <p>{month}月のLLMでの分析結果がここに入ります</p>
          {viewCount < 3 ? (
            <>
              <p>{data.advice}</p>
              <button onClick={handleViewClick} className="p-2 mt-4 bg-custom-blue text-white rounded">
                分析結果を表示
              </button>
            </>
          ) : (
            <>
              <div className="blur-sm">
                <p>{data.advice}</p>
              </div>
              <p className="mt-4">続きを見たい場合は会員登録をしてください。</p>
              <button className="p-2 mt-2 bg-custom-blue text-white rounded">
                登録はこちら
              </button>
            </>
          )}
        </div>
        <div className="absolute top-1/2 left-full transform -translate-y-1/2 w-0 h-0 border-t-8 
          border-t-transparent border-b-8 border-b-transparent 
          border-l-8 border-l-custom-light-blue"></div>
      </div>
      <div className="ml-4">
        <video
          src="/LLMicon1.mp4"
          loop
          muted
          autoPlay
          className="w-32 h-40 object-cover"
        />
      </div>
    </div>
  );
};

export default OpenaiAnalysis;
