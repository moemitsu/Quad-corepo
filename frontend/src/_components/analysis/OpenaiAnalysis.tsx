// src/_components/OpenaiAnalysis.tsx
'use client'
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../../lib/firebase';

interface OpenaiAnalysisProps {
  month: number;
}

interface AnalysisData {
  summary: {
    dates: {
      date: string;
      activities: {
        user_name: string;
        activity: string;
        start_time: string;
        end_time: string;
      }[];
    }[];
    ratios: {
      [key: string]: number;
    };
  };
  analysis: {
    llm_summary: string;
    llm_sentiment: string;
  };
}

const OpenaiAnalysis: React.FC<OpenaiAnalysisProps> = ({ month }) => {
  const [user] = useAuthState(auth);
  const [data, setData] = useState<AnalysisData | null>(null);
  const [viewCount, setViewCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true); // データ読み込み中の状態

  // LLMの分析結果を取得
  useEffect(() => {
    if (user) {
      const fetchData = async () => {
        try {
          const response = await axios.get('http://localhost:8000/api/v1/main', {
            params: {
              month: `2024-${month.toString().padStart(2, '0')}`,
            },
          });
          setData(response.data);
        } catch (error) {
          console.error('データ取得に失敗しました', error);
        } finally {
          setLoading(false); // 読み込み完了
        }
      };
      fetchData();
    }
  }, [user, month]);

  const handleViewClick = () => {
    setViewCount(viewCount + 1);
  };

  if (!user) {
    return <p>ログインしてください。</p>;
  }

  if (loading) {
    return <p>データを読み込んでいます...</p>;
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
              <p>{data.analysis.llm_summary}</p>
              <p>{data.analysis.llm_sentiment}</p>
              <button onClick={handleViewClick} className="p-2 mt-4 bg-custom-blue text-white rounded">
                分析結果を表示
              </button>
            </>
          ) : (
            <>
              <div className="blur-sm">
                <p>{data.analysis.llm_summary}</p>
                <p>{data.analysis.llm_sentiment}</p>
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
        <img src='/LLMicon.png' alt="LLM Icon" className="w-30 h-41" />
      </div>
    </div>
  );
};

export default OpenaiAnalysis;
