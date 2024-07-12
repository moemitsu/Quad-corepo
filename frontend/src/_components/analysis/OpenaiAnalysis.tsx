// src/_components/analysis/OpenaiAnalysis.tsx
'use client'
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../../lib/firebase';
import { useRouter } from 'next/navigation';

interface OpenaiAnalysisProps {
  selectedYear: number;
  selectedMonth: number;
  selectedChild: string;
}

interface AnalysisData {
  advice: string;
}

const OpenaiAnalysis: React.FC<OpenaiAnalysisProps> = ({ selectedYear, selectedMonth, selectedChild }) => {
  const [user] = useAuthState(auth);
  const [data, setData] = useState<AnalysisData | null>(null);
  const [viewCount, setViewCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();

  const fetchData = async () => {
    if (user) {
      try {
        setLoading(true);
        const token = await user.getIdToken();
        const response = await axios.get('http://localhost:8000/api/v1/analysis', {
          params: {
            year: selectedYear,
            month: selectedMonth,
            child_name: selectedChild,
          },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setData(response.data);
      } catch (error) {
        console.error('データ取得に失敗しました', error);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleViewClick = () => {
    setViewCount(viewCount + 1);
    fetchData();
  };

  const handleRegisterClick = () => {
    router.push('/payment');
  };

  if (!user) {
    return <p>ログインしてください。</p>;
  }

  return (
    <div className="flex mt-4 items-center justify-center">
      <div className="relative bg-white p-6 rounded-lg shadow-md self-start flex items-center">
        <div>
          <h3 className="text-2xl font-semibold mb-2">LLMでの分析</h3>
          {viewCount < 3 ? (
            <>
              <button onClick={handleViewClick} className="p-2 mt-4 bg-custom-blue text-white rounded">
                分析結果を表示
              </button>
              {loading ? (
                <p>データを読み込んでいます...</p>
              ) : (
                data && (
                  <div>
                    <p>{data.advice}</p>
                  </div>
                )
              )}
            </>
          ) : (
            <>
              <div className="blur-sm">
                <p>{data ? data.advice : 'データを取得できませんでした。'}</p>
              </div>
              <p className="mt-4">続きを見たい場合は会員登録をしてください。</p>
              <button onClick={handleRegisterClick} className="p-2 mt-2 bg-custom-blue text-white rounded">
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
          className="w-96 h-60"
        />
      </div>
    </div>
  );
};

export default OpenaiAnalysis;
