// src/_components/RecordList.tsx
'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface Record {
  id: number;
  stakeholder_id: string;
  with_member: string;
  child_name: string;
  events: string;
  child_condition: string;
  place: string;
  share_start_at: string;
  share_end_at: string;
}

const RecordList: React.FC = () => {
  const [records, setRecords] = useState<Record[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/v1/total-data');
        setRecords(response.data);
        setLoading(false);
      } catch (error) {
        setError('データの取得に失敗しました');
        setLoading(false);
      }
    };

    fetchData();
  }, []);

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
        {records.slice(0, 5).map(record => (
          <li key={record.id} className="mb-2">
            <div className="p-4 bg-white shadow rounded">
              <p><strong>子供の名前:</strong> {record.child_name}</p>
              <p><strong>イベント:</strong> {record.events}</p>
              <p><strong>条件:</strong> {record.child_condition}</p>
              <p><strong>場所:</strong> {record.place}</p>
              <p><strong>開始時間:</strong> {new Date(record.share_start_at).toLocaleString()}</p>
              <p><strong>終了時間:</strong> {new Date(record.share_end_at).toLocaleString()}</p>
            </div>
          </li>
        ))}
        {records.length > 5 && (
          <ul className="max-h-96 overflow-y-auto">
            {records.slice(5).map(record => (
              <li key={record.id} className="mb-2">
                <div className="p-4 bg-white shadow rounded">
                  <p><strong>子供の名前:</strong> {record.child_name}</p>
                  <p><strong>イベント:</strong> {record.events}</p>
                  <p><strong>条件:</strong> {record.child_condition}</p>
                  <p><strong>場所:</strong> {record.place}</p>
                  <p><strong>開始時間:</strong> {new Date(record.share_start_at).toLocaleString()}</p>
                  <p><strong>終了時間:</strong> {new Date(record.share_end_at).toLocaleString()}</p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </ul>
    </div>
  );
};

export default RecordList;
