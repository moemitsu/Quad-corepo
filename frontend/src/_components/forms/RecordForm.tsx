'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';

const RecordForm: React.FC = () => {
  const with_members = ['母', '父', '祖母', '祖父', '保育士', '友達', '姉', '兄'];
  const events = ['遊び', '食事', '睡眠', '勉強', '習い事'];
  const places = ['家', '公園', '保育園・保育園', 'その他'];
  const child_conditions = ['☀️☀️', '☀️', '☁️', '☂️', '☂️☂️'];

  const [selectedWithMember, setSelectedWithMember] = useState<string>('');
  const [selectedChild, setSelectedChild] = useState<string>('');
  const [selectedEvent, setSelectedEvent] = useState<string>('');
  const [childCondition, setChildCondition] = useState<string>('');
  const [selectedPlace, setSelectedPlace] = useState<string>('');
  const [startDate, setStartDate] = useState<string>('');
  const [startTime, setStartTime] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [endTime, setEndTime] = useState<string>('');
  const [children, setChildren] = useState<string[]>([]); // 初期値を空の配列に設定

  useEffect(() => {
    const fetchChildren = async () => {
      try {
        const response = await axios.get('http://localhost:8000/'); //子供の名前を取得するエンドポイント
        setChildren(response.data.children || []); // レスポンスが存在しない場合に空の配列を設定
      } catch (error) {
        console.error('Error fetching children: ', error);
      }
    };

    fetchChildren();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:8000/api/v1/records', {
        with_member: selectedWithMember,
        child: selectedChild,
        events: selectedEvent,
        child_condition: childCondition,
        place: selectedPlace,
        startDate,
        startTime,
        endDate,
        endTime,
      });
      alert('活動が記録されました！');
      console.log('Response:', response.data);
    } catch (error) {
      console.error('Error adding document: ', error);
      alert('エラーが発生しました。もう一度試してください。');
    }
  };

  return (
    <div className="p-6 bg-custom-green min-h-screen flex flex-col">
      <div className="flex items-center justify-between">
      </div>
      <form onSubmit={handleSubmit} className="mt-12 bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-4xl font-bold mb-6">活動の記録</h2>
        <div className="mb-4">
          <label htmlFor="with_member" className="block text-lg font-semibold mb-2">保護者の名前</label>
          <select
            id="with_member"
            value={selectedWithMember}
            onChange={(e) => setSelectedWithMember(e.target.value)}
            required
            className="w-full p-2 border border-gray-300 rounded"
          >
            <option value="">選択してください</option>
            {with_members.map((member, index) => (
              <option key={index} value={member}>{member}</option>
            ))}
          </select>
        </div>
        <div className="mb-4">
          <label htmlFor="child" className="block text-lg font-semibold mb-2">子供の名前</label>
          <select
            id="child"
            value={selectedChild}
            onChange={(e) => setSelectedChild(e.target.value)}
            required
            className="w-full p-2 border border-gray-300 rounded"
          >
            <option value="">選択してください</option>
            {children.map((child, index) => (
              <option key={index} value={child}>{child}</option>
            ))}
          </select>
        </div>
        <div className="mb-4">
          <label htmlFor="events" className="block text-lg font-semibold mb-2">どんなこと</label>
          <select
            id="events"
            value={selectedEvent}
            onChange={(e) => setSelectedEvent(e.target.value)}
            required
            className="w-full p-2 border border-gray-300 rounded"
          >
            <option value="">選択してください</option>
            {events.map((event, index) => (
              <option key={index} value={event}>{event}</option>
            ))}
          </select>
        </div>
        <div className="mb-4">
          <label htmlFor="child_condition" className="block text-lg font-semibold mb-2">子供の気分</label>
          <select
            id="child_condition"
            value={childCondition}
            onChange={(e) => setChildCondition(e.target.value)}
            required
            className="w-full p-2 border border-gray-300 rounded"
          >
            <option value="">選択してください</option>
            {child_conditions.map((condition, index) => (
              <option key={index} value={condition}>{condition}</option>
            ))}
          </select>
        </div>
        <div className="mb-4">
          <label htmlFor="place" className="block text-lg font-semibold mb-2">場所</label>
          <select
            id="place"
            value={selectedPlace}
            onChange={(e) => setSelectedPlace(e.target.value)}
            required
            className="w-full p-2 border border-gray-300 rounded"
          >
            <option value="">選択してください</option>
            {places.map((place, index) => (
              <option key={index} value={place}>{place}</option>
            ))}
          </select>
        </div>
        <div className="mb-4">
          <label htmlFor="startDate" className="block text-lg font-semibold mb-2">開始日時</label>
          <input
            type="date"
            id="startDate"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            required
            className="w-full p-2 border border-gray-300 rounded mb-2"
          />
          <input
            type="time"
            id="startTime"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            required
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="endDate" className="block text-lg font-semibold mb-2">終了日時</label>
          <input
            type="date"
            id="endDate"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            required
            className="w-full p-2 border border-gray-300 rounded mb-2"
          />
          <input
            type="time"
            id="endTime"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            required
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>
        <button type="submit" className="p-2 bg-custom-teal text-white rounded">記録する</button>
      </form>
    </div>
  );
};

export default RecordForm;
