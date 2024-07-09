'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Header from'../../_components/layout/Header';
import Footer from '../../_components/layout/Footer';

const Hello: React.FC = () => {
  const [data, setData] = useState<{ message: string } | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get<{ message: string }>(
          'http://localhost:8000'
        );
        setData(response.data);
      } catch (error) {
        console.error('データ取得に失敗しました', error);
      }
    };
    fetchData();
  }, []);

  if (!data) {
    return <p>データを読み込んでいます...</p>;
  }

  return (
    <div >
      <Header />
      <div className="flex mt-4 items-center justify-center">
        <div className="relative bg-white p-6 rounded-lg shadow-md self-start flex items-center">
          <div>
            <h3 className="text-2xl font-semibold mb-2">LLMでの分析</h3>
            <p>{data.message}</p> {/* dataからmessageプロパティを表示 */}
          </div>
          <div
            className="absolute top-1/2 left-full transform -translate-y-1/2 w-0 h-0 border-t-8 
          border-t-transparent border-b-8 border-b-transparent 
          border-l-8 border-l-wthite"
          ></div>
        </div>
        <div className="ml-4">
          <video
            src="/LLMicon1.mp4"
            loop
            muted
            autoPlay
            className="w-26 h-40"
          />
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Hello;
