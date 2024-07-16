'use client'
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

  // State for filters
  const [selectedWithMember, setSelectedWithMember] = useState<string>('');
  const [selectedEvent, setSelectedEvent] = useState<string>('');
  const [selectedChildCondition, setSelectedChildCondition] = useState<string>('');
  const [selectedPlace, setSelectedPlace] = useState<string>('');

  // State for options
  const [withMemberOptions, setWithMemberOptions] = useState<string[]>([]);
  const [eventOptions, setEventOptions] = useState<string[]>([]);
  const [childConditionOptions, setChildConditionOptions] = useState<string[]>([]);
  const [placeOptions, setPlaceOptions] = useState<string[]>([]);

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

        const fetchedRecords: Record[] = response.data;
        setRecords(fetchedRecords);
        setLoading(false);

       //データからドロップダウンリストを生成
        const withMembers = [...new Set(fetchedRecords.map(record => record.with_member))];
        const events = [...new Set(fetchedRecords.map(record => record.events))];
        const childConditions = [...new Set(fetchedRecords.map(record => record.child_condition))];
        const places = [...new Set(fetchedRecords.map(record => record.place))];

        setWithMemberOptions(withMembers);
        setEventOptions(events);
        setChildConditionOptions(childConditions);
        setPlaceOptions(places);
      } catch (error: any) {
        setError('データの取得に失敗しました');
        setLoading(false);
      }
    };

    if (selectedChildName) {
      fetchData();
    }
  }, [selectedYear, selectedMonth, selectedChildName, bearerToken]);

  // 選択から抽出してリストを表示
  const filteredRecords = records.filter(record =>
    (selectedWithMember ? record.with_member === selectedWithMember : true) &&
    (selectedEvent ? record.events === selectedEvent : true) &&
    (selectedChildCondition ? record.child_condition === selectedChildCondition : true) &&
    (selectedPlace ? record.place === selectedPlace : true)
  );

  if (loading) {
    return <p>読み込み中...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div className="p-4 bg-custom-light-green bg-opacity-50 shadow-inner">
      <h2 className="text-xl text-custom-blue font-semibold mb-4">{selectedMonth}月の{selectedChildName}さんの記録リスト</h2>

      {/* Dropdown selectors */}
      <div className="flex mb-4 space-x-4">
        {/* Dropdown for with_member */}
        <select
          value={selectedWithMember}
          onChange={(e) => setSelectedWithMember(e.target.value)}
          className="border border-gray-300 rounded px-2 py-1"
        >
          <option value="">保護者で絞り込む</option>
          {withMemberOptions.map(option => (
            <option key={option} value={option}>{option}</option>
          ))}
        </select>

        {/* Dropdown for events */}
        <select
          value={selectedEvent}
          onChange={(e) => setSelectedEvent(e.target.value)}
          className="border border-gray-300 rounded px-2 py-1"
        >
          <option value="">イベントで絞り込む</option>
          {eventOptions.map(option => (
            <option key={option} value={option}>{option}</option>
          ))}
        </select>

        {/* Dropdown for child_condition */}
        <select
          value={selectedChildCondition}
          onChange={(e) => setSelectedChildCondition(e.target.value)}
          className="border border-gray-300 rounded px-2 py-1"
        >
          <option value="">ご機嫌で絞り込む</option>
          {childConditionOptions.map(option => (
            <option key={option} value={option}>{option}</option>
          ))}
        </select>

        {/* Dropdown for place */}
        <select
          value={selectedPlace}
          onChange={(e) => setSelectedPlace(e.target.value)}
          className="border border-gray-300 rounded px-2 py-1"
        >
          <option value="">場所で絞り込む</option>
          {placeOptions.map(option => (
            <option key={option} value={option}>{option}</option>
          ))}
        </select>
      </div>

      {/* Display filtered records */}
      <ul className="max-h-96 overflow-y-auto">
        {filteredRecords.map(record => (
          <li key={record.id} className="mb-2">
            <div className="p-4 text-gray-600 bg-custom-light-green bg-opacity-50 shadow-inner rounded flex flex-wrap">
              <p className="w-full md:w-1/7"><strong>保護者:</strong> {record.with_member}</p>
              <p className="w-full md:w-1/6"><strong>ご機嫌:</strong> {record.child_condition}</p>
              <p className="w-full md:w-1/6"><strong>イベント:</strong> {record.events}</p>       
              <p className="w-full md:w-1/6"><strong>場所:</strong> {record.place}</p>
              <p className="w-full md:w-1/5"><strong>開始時間:</strong> {new Date(record.share_start_at).toLocaleString()}</p>
              <p className="w-full md:w-1/5"><strong>終了時間:</strong> {new Date(record.share_end_at).toLocaleString()}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RecordList;
