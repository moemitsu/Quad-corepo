// LLMAnalysis.tsx
'use client'
import React from 'react';

interface OpenaiAnalysisProps {
    month: number;
  }
  
  const OpenaiAnalysis: React.FC<OpenaiAnalysisProps> = ({ month }) => {
    // ここにOpenAIを使用した分析や推薦ロジックを追加する予定です
    return (
      <div className="flex mt-4 items-center justify-end">
        <div className="relative bg-custom-light-blue p-6 rounded-lg shadow-md self-start flex items-center">
          <div>
            <h3 className="text-2xl font-semibold mb-2">LLMでの分析</h3>
            <p>{month}月のLLMでの分析結果がここに入ります</p>
            <p>LLMでの分析結果がここに入りますhogehogehugahuga</p>
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