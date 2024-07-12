
'use client';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../../lib/firebase';
import { useRouter } from 'next/navigation';

const router = useRouter();

interface OpenaiAnalysisProps {
  year: number;
  month: number;
  selectedChildName: string;
}

interface AnalysisData {
  advice: string;
}

const OpenaiAnalysis: React.FC<OpenaiAnalysisProps> = ({ year, month, selectedChildName }) => {

  const [user] = useAuthState(auth);
  const [data, setData] = useState<AnalysisData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [viewCount, setViewCount] = useState<number>(0);

  useEffect(() => {
    const fetchData = async () => {
      if (user) {
        setLoading(true);
        setError(null);
        try {
          const token = await user.getIdToken();
          console.log("Requesting analysis data with params:", {
            year: year,
            month: month,
            child_name: selectedChildName,
          });
          const response = await axios.get('http://localhost:8000/api/v1/analysis', {
            params: {
              year: year,
              month: month,
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

    if (viewCount > 0 && viewCount <= 3) {
      fetchData();
    }
  }, [user, year, month, selectedChildName, viewCount]);

  const handleViewClick = () => {
    setViewCount(viewCount + 1);
  };

  const handleRegisterClick = () => {
    router.push('/payment');
  };

  if (!user) {
    return <p>ログインしてください。</p>;
  }

  return (

    <div className="flex mt-4 items-center justify-center flex-col">
      {viewCount < 4 ? (
        <button
          onClick={handleViewClick}
          className="p-2 mt-4 bg-custom-blue text-white rounded"
          disabled={loading}
        >
          AIによる分析結果を表示する
        </button>
      ) : (
        <button
          onClick={() => alert('有料会員登録はこちらから')}
          className="p-2 mt-4 bg-custom-teal text-white rounded"
        >
          有料会員登録はこちら
        </button>
      )}

      {loading && <p>データを読み込んでいます...</p>}
      {error && <p>{error}</p>}

      {viewCount > 0 && data && (
        <div className={`relative bg-white p-6 rounded-lg shadow-md self-start flex items-center mt-4 ${viewCount >= 4 ? 'blur-sm' : ''}`}>
          <div>
            <h3 className="text-2xl font-semibold mb-2">LLMでの分析</h3>
            <p>{month}月のLLMでの分析結果です</p>
            <p>{data.advice}</p>
          </div>
          <div className="absolute top-1/2 left-full transform -translate-y-1/2 w-0 h-0 border-t-8 
            border-t-transparent border-b-8 border-b-transparent 
            border-l-8 border-l-custom-light-blue"></div>
        </div>
      )}

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
