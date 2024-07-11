// src/_components/analysis/TotalHours.tsx

'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface TotalHoursProps {
  selectedYear: number;
  selectedMonth: number;
  selectedChild: string;
  bearerToken: string;
}

interface MemberHours {
  [key: string]: number;
}

interface ApiResponse {
  [key: string]: {
    [date: string]: number;
  };
}

const TotalHours: React.FC<TotalHoursProps> = ({ selectedYear, selectedMonth, selectedChild, bearerToken }) => {
  const [totalHours, setTotalHours] = useState<number>(0);
  const [memberHours, setMemberHours] = useState<MemberHours>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTotalHours = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/v1/bar-graph', {
          params: {
            year: selectedYear,
            month: selectedMonth,
            child_name: selectedChild,
          },
          headers: {
            Authorization: `Bearer ${bearerToken}`,
          },
        });

        const data: ApiResponse = response.data;
        const familyMembers = Object.keys(data).filter(key => key !== 'summary');

        const totalHours = familyMembers.reduce((acc, member) => {
          return acc + Object.values(data[member]).reduce((sum, hours) => sum + hours, 0);
        }, 0);

        const memberHours: MemberHours = familyMembers.reduce((acc, member) => {
          acc[member] = Object.values(data[member]).reduce((sum, hours) => sum + hours, 0);
          return acc;
        }, {} as MemberHours);

        setTotalHours(totalHours);
        setMemberHours(memberHours);
        setLoading(false);
        setError(null);
      } catch (error) {
        setError('データの取得に失敗しました');
        setLoading(false);
      }
    };

    if (selectedChild) {
      fetchTotalHours();
    }
  }, [selectedYear, selectedMonth, selectedChild, bearerToken]);

  // 分を時間と分に変換して、小数点以下を四捨五入する関数
  const formatHours = (minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    const mins = Math.round(minutes % 60); // 四捨五入
    return `${hours}時間 ${mins}分`;
  };

  if (loading) {
    return <p>読み込み中...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div className="bg-custom-light-green bg-opacity-50 p-4 md:p-6 rounded-lg shadow-inner">
      <h3 className="text-xl text-custom-blue mb-2">一緒に過ごした時間の合計</h3>
      <div>
        <p>全合計: {formatHours(totalHours * 60)}</p>
        {Object.entries(memberHours).map(([member, minutes]) => (
          <p key={member}>{member}: {formatHours(minutes)}</p>
        ))}
      </div>
    </div>
  );
};

export default TotalHours;
