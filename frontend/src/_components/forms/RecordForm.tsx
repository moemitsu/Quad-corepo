'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../hooks/useAuth';

const RecordForm: React.FC = () => {
  const { user } = useAuth();
  const events = ['遊び', '生活(食事、風呂、寝かしつけなど)', '見守り(習い事、勉強など)'];
  const places = ['家', '屋内', '戸外', '保育園・幼稚園', 'その他'];
  const child_conditions = ['☀️☀️', '☀️', '☁️', '☂️', '☂️☂️'];

  const [selectedAdultName, setSelectedAdultName] = useState<string>('');
  const [selectedChildName, setSelectedChildName] = useState<string>('');
  const [selectedEvent, setSelectedEvent] = useState<string>('');
  const [childCondition, setChildCondition] = useState<string>('');
  const [selectedPlace, setSelectedPlace] = useState<string>('');
  const [startDate, setStartDate] = useState<string>('');
  const [startTime, setStartTime] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [endTime, setEndTime] = useState<string>('');
  const [children, setChildren] = useState<string[]>([]);
  const [adultNames, setAdultNames] = useState<string[]>([]);

  useEffect(() => {
    const fetchChildrenAndAdults = async () => {
      try {
        if (!user) {
          throw new Error('ユーザーが認証されていません。');
        }

        const token = await user.getIdToken();
        console.log('取得したトークン:', token);

        const response = await axios.get('http://localhost:8000/api/v1/names', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        console.log('APIからの応答:', response.data);

        setChildren(response.data.child_names || []);
        setAdultNames(response.data.adult_names || []);
      } catch (error: any) {
        console.error('データ取得エラー: ', error);
        if (axios.isAxiosError(error)) {
          console.error('エラーレスポンス:', error.response?.data);
        } else {
          console.error('予期しないエラー:', error);
        }
      }
    };

    fetchChildrenAndAdults();
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (!user) {
        throw new Error('ユーザーが認証されていません。');
      }

      const token = await user.getIdToken();

      const shareStartAt = new Date(`${startDate}T${startTime}:00.000Z`).toISOString();
      const shareEndAt = new Date(`${endDate}T${endTime}:00.000Z`).toISOString();

      const requestBody = {
        with_member: selectedAdultName,
        child_name: selectedChildName,
        events: selectedEvent,
        child_condition: childCondition,
        place: selectedPlace,
        share_start_at: shareStartAt,
        share_end_at: shareEndAt,
      };

      console.log('送信するリクエストボディ:', JSON.stringify(requestBody, null, 2));

      const response = await axios.post('http://localhost:8000/api/v1/record', requestBody, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      alert('活動が記録されました！');
      console.log('Response:', response.data);

      // フォームのステートをリセット
      setSelectedAdultName('');
      setSelectedChildName('');
      setSelectedEvent('');
      setChildCondition('');
      setSelectedPlace('');
      setStartDate('');
      setStartTime('');
      setEndDate('');
      setEndTime('');
      
    } catch (error: any) {
      console.error('ドキュメント追加エラー: ', error);

      if (axios.isAxiosError(error)) {
        console.error('エラーレスポンス:', error.response?.data);
      }

      alert('エラーが発生しました。もう一度試してください。');
    }
  };

  return (
    <div className="p-6 min-h-screen flex flex-col justify-center items-center">
      <div className="p-6 rounded-lg shadow-md w-full max-w-2xl bg-white">
        <h2 className="text-4xl font-bold mb-6 text-center">活動の記録</h2>
        <form onSubmit={handleSubmit}>
          <RadioGroup
            label="保護者の名前"
            name="adult_name"
            options={adultNames}
            selectedOption={selectedAdultName}
            onChange={setSelectedAdultName}
          />
          <RadioGroup
            label="子供の名前"
            name="child"
            options={children}
            selectedOption={selectedChildName}
            onChange={setSelectedChildName}
          />
          <RadioGroup
            label="どんなこと"
            name="event"
            options={events}
            selectedOption={selectedEvent}
            onChange={setSelectedEvent}
          />
          <RadioGroup
            label="場所"
            name="place"
            options={places}
            selectedOption={selectedPlace}
            onChange={setSelectedPlace}
          />
          <RadioGroup
            label="子供の気分"
            name="child_condition"
            options={child_conditions}
            selectedOption={childCondition}
            onChange={setChildCondition}
          />
          <DateTimeInput
            label="開始日時"
            date={startDate}
            time={startTime}
            onDateChange={setStartDate}
            onTimeChange={setStartTime}
          />
          <DateTimeInput
            label="終了日時"
            date={endDate}
            time={endTime}
            onDateChange={setEndDate}
            onTimeChange={setEndTime}
          />
          <button type="submit" className="w-full p-2 bg-custom-teal text-white rounded">記録する</button>
        </form>
      </div>
    </div>
  );
};

const RadioGroup: React.FC<{
  label: string;
  name: string;
  options: string[];
  selectedOption: string;
  onChange: (value: string) => void;
}> = ({ label, name, options, selectedOption, onChange }) => (
  <div className="mb-4">
    <label htmlFor={name} className="block text-lg font-semibold mb-2">{label}</label>
    <div className="flex space-x-4">
      {options.map((option, index) => (
        <label key={index} className="inline-flex items-center">
          <input
            type="radio"
            name={name}
            value={option}
            checked={selectedOption === option}
            onChange={(e) => onChange(e.target.value)}
            className="form-radio"
          />
          <span className="ml-2">{option}</span>
        </label>
      ))}
    </div>
  </div>
);

const DateTimeInput: React.FC<{
  label: string;
  date: string;
  time: string;
  onDateChange: (date: string) => void;
  onTimeChange: (time: string) => void;
}> = ({ label, date, time, onDateChange, onTimeChange }) => (
  <div className="mb-4">
    <label className="block text-lg font-semibold mb-2">{label}</label>
    <input
      type="date"
      value={date}
      onChange={(e) => onDateChange(e.target.value)}
      required
      className="w-full p-2 border border-gray-300 rounded mb-2"
    />
    <input
      type="time"
      value={time}
      onChange={(e) => onTimeChange(e.target.value)}
      required
      className="w-full p-2 border border-gray-300 rounded"
    />
  </div>
);

export default RecordForm;
