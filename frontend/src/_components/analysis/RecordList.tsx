'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface Record {
  id: number;
  with_member: string;
  events: string;
  child_condition: string;
  place: string;
  share_start_at: string;
  share_end_at: string;
}

interface RecordListProps {
  selectedYear: number;
  selectedMonth: number;
  selectedChildName: string;
  bearerToken: string;
}

const RecordList: React.FC<RecordListProps> = ({ selectedYear, selectedMonth, selectedChildName, bearerToken }) => {
  const [records, setRecords] = useState<Record[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/v1/family-records', {
          params: {
            year: selectedYear,
            month: selectedMonth,
            child_name: selectedChildName,
          },
          headers: {
            Authorization: `Bearer ${bearerToken}`,
          },
        });
        setRecords(response.data);
        setLoading(false);
      } catch (error: any) {
        setError('データの取得に失敗しました');
        setLoading(false);
      }
    };

    if (selectedChildName) {
      fetchData();
    }
  }, [selectedYear, selectedMonth, selectedChildName, bearerToken]);

  if (loading) {
    return <p>読み込み中...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">記録リスト</h2>
      <ul className="max-h-96 overflow-y-auto">
        {records.map(record => (
          <li key={record.id} className="mb-2">
            <div className="p-4 bg-white shadow rounded">
              <p><strong>保護者:</strong> {record.with_member}</p>
              <p><strong>イベント:</strong> {record.events}</p>
              <p><strong>ご機嫌:</strong> {record.child_condition}</p>
              <p><strong>場所:</strong> {record.place}</p>
              <p><strong>開始時間:</strong> {new Date(record.share_start_at).toLocaleString()}</p>
              <p><strong>終了時間:</strong> {new Date(record.share_end_at).toLocaleString()}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RecordList;
