'use client';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../../lib/firebase';
import { useRouter } from 'next/navigation';
import parse from 'html-react-parser';

interface OpenaiAnalysisProps {
  year: number;
  month: number;
  selectedChildName: string;
}

interface AnalysisData {
  advice: string;
}

const OpenaiAnalysis: React.FC<OpenaiAnalysisProps> = ({ year, month, selectedChildName }) => {
  const router = useRouter();
  const [user] = useAuthState(auth);
  const [data, setData] = useState<AnalysisData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [viewCount, setViewCount] = useState<number>(0);
  const [showOverlay, setShowOverlay] = useState<boolean>(true);

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
          setData({ advice: response.data.advice.replace(/\n/g, '<br />') });
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

  const handleDismissOverlay = () => {
    setShowOverlay(false);
  };

  if (!user) {
    return <p>ログインしてください。</p>;
  }

  return (
    <div className="flex flex-col items-center mt-4">
      {viewCount === 0 ? (
        <div className="flex items-center">
          <button
            onClick={handleViewClick}
            className="p-2 px-2 m-2 bg-custom-teal text-md text-white rounded shadow-md hover:bg-custom-blue transition-colors"
            disabled={loading}
          >
            {loading ? 'データ分析中...' : 'AIによる分析結果を表示する'}
          </button>
          <div className="relative">
            <div className="absolute top-1/2 left-full transform -translate-y-1/2 w-0 h-0 border-t-8 border-t-transparent border-b-8 border-b-transparent border-l-8 border-l-custom-light-blue"></div>
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
      ) : (
        <div className="flex items-start w-full">
          <div className="relative bg-white p-6 rounded-lg shadow-md mt-4 flex-grow">
            <div>
              <h3 className="text-2xl font-semibold mb-2">AI分析</h3>
              <h4>{month}月のAI分析結果です</h4>
              <div className="relative">
                <p className={viewCount >= 4 && showOverlay ? 'blur-md' : ''}>{data && parse(data.advice)}</p>
                {viewCount >= 4 && showOverlay && (
                  <div className="absolute top-0 left-0 w-full h-full flex flex-col items-center justify-center bg-white bg-opacity-75">
                    <p className="text-xl font-bold text-gray-800 mb-4">月3回以上のデータ分析はAI分析使い放題プランへのアップグレードが必要です</p>
                    <button
                      onClick={handleRegisterClick}
                      className="p-2 px-2 m-2 bg-custom-teal text-md text-white rounded shadow-md hover:bg-custom-blue transition-colors"
                    >
                      AI分析使い放題プランへアップグレード
                    </button>
                    <button
                      onClick={handleDismissOverlay}
                      className="p-2 px-2 m-2 bg-custom-teal text-md text-white rounded shadow-md hover:bg-custom-blue transition-colors"
                    >
                      アップグレードしない
                    </button>
                  </div>
                )}
              </div>
              {viewCount < 4 && (
                <div className="flex justify-center">
                  <button
                    onClick={handleViewClick}
                    className="p-2 px-2 m-2 bg-custom-teal text-md text-white rounded shadow-md hover:bg-custom-blue transition-colors"
                    disabled={loading}
                  >
                    {loading ? 'データ分析中...' : '更に分析結果を表示する'}
                  </button>
                </div>
              )}
            </div>
            <div className="absolute top-1/2 left-full transform -translate-y-1/2 w-0 h-0 border-t-8 border-t-transparent border-b-8 border-b-transparent border-l-8 border-l-custom-light-blue"></div>
          </div>
          <div className="ml-4 mt-4 self-center">
            <video
              src="/LLMicon1.mp4"
              loop
              muted
              autoPlay
              className="w-96 h-60"
            />
          </div>
        </div>
      )}

      {error && <p>{error}</p>}
    </div>
  );
};

export default OpenaiAnalysis;
