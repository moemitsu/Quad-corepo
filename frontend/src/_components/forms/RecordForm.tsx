'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../hooks/useAuth';

const RecordForm: React.FC = () => {
  const { user } = useAuth();
  const activities = ['遊び', '生活', '見守り'];
  const playActivities = ['遊具', '工作', 'お絵描き', 'ごっこ遊び', '小鉄活動', '絵本読み', 'お散歩', '運動'];
  const lifeActivities = ['食事', 'お風呂', '寝かしつけ', 'その他'];
  const watchActivities = ['習い事', '勉強', 'その他'];
  const places = ['家', '屋内', '戸外', '保育園・幼稚園', 'その他'];
  const child_conditions = ['☀️☀️', '☀️', '☁️', '☂️', '☂️☂️'];

  const [selectedAdultName, setSelectedAdultName] = useState<string>('');
  const [selectedChildName, setSelectedChildName] = useState<string>('');
  const [selectedEvent, setSelectedEvent] = useState<string>('');
  const [selectedSubActivity, setSelectedSubActivity] = useState<string>('');
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
          }
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

  // 開始日時が変更された時に終了日時も同じ値に設定する
  useEffect(() => {
    setEndDate(startDate);
  }, [startDate]);

// 開始時間が変更された時に終了日時も同じ値に設定する
  // useEffect(() => {
  //   setEndTime(startTime);
  // }, [startTime]);


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
      setSelectedSubActivity('');
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
    <div className="p-6 bg-custom-light-green min-h-screen flex flex-col justify-center items-center">
      <div className="p-6 rounded-lg shadow-md w-full max-w-2xl bg-white">
        <h2 className="text-4xl font-bold mb-6 text-center">活動の記録</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="adult_name" className="block text-lg font-semibold mb-2">保護者の名前</label>
            <div className="flex flex-wrap">
              {adultNames.map((adultName, index) => (
                <label key={index} className="inline-flex items-center mr-4 mb-2">
                  <input
                    type="radio"
                    name="adult_name"
                    value={adultName}
                    checked={selectedAdultName === adultName}
                    onChange={(e) => setSelectedAdultName(e.target.value)}
                    className="form-radio"
                  />
                  <span className="ml-2">{adultName}</span>
                </label>
              ))}
            </div>
          </div>
          <div className="mb-4">
            <label htmlFor="child" className="block text-lg font-semibold mb-2">子供の名前</label>
            <div className="flex flex-wrap">
              {children.map((child, index) => (
                <label key={index} className="inline-flex items-center mr-4 mb-2">
                  <input
                    type="radio"
                    name="child"
                    value={child}
                    checked={selectedChildName === child}
                    onChange={(e) => setSelectedChildName(e.target.value)}
                    className="form-radio"
                  />
                  <span className="ml-2">{child}</span>
                </label>
              ))}
            </div>
          </div>
          <div className="mb-4">
            <label htmlFor="activity" className="block text-lg font-semibold mb-2">活動</label>
            <div className="flex flex-wrap">
              {activities.map((activity, index) => (
                <label key={index} className="inline-flex items-center mr-4 mb-2">
                  <input
                    type="radio"
                    name="activity"
                    value={activity}
                    checked={selectedEvent === activity}
                    onChange={(e) => setSelectedEvent(e.target.value)}
                    className="form-radio"
                  />
                  <span className="ml-2">{activity}</span>
                </label>
              ))}
            </div>
          </div>
          {selectedEvent === '遊び' && (
            <div className="mb-4">
              <label htmlFor="sub_activity" className="block text-lg font-semibold mb-2">遊びの種類</label>
              <div className="flex flex-wrap">
                {playActivities.map((subActivity, index) => (
                  <label key={index} className="inline-flex items-center mr-4 mb-2">
                    <input
                      type="radio"
                      name="sub_activity"
                      value={subActivity}
                      checked={selectedSubActivity === subActivity}
                      onChange={(e) => setSelectedSubActivity(e.target.value)}
                      className="form-radio"
                    />
                    <span className="ml-2">{subActivity}</span>
                  </label>
                ))}
              </div>
            </div>
          )}
          {selectedEvent === '生活' && (
            <div className="mb-4">
              <label htmlFor="sub_activity" className="block text-lg font-semibold mb-2">生活の種類</label>
              <div className="flex flex-wrap">
                {lifeActivities.map((subActivity, index) => (
                  <label key={index} className="inline-flex items-center mr-4 mb-2">
                    <input
                      type="radio"
                      name="sub_activity"
                      value={subActivity}
                      checked={selectedSubActivity === subActivity}
                      onChange={(e) => setSelectedSubActivity(e.target.value)}
                      className="form-radio"
                    />
                    <span className="ml-2">{subActivity}</span>
                  </label>
                ))}
              </div>
            </div>
          )}
          {selectedEvent === '見守り' && (
            <div className="mb-4">
              <label htmlFor="sub_activity" className="block text-lg font-semibold mb-2">見守りの種類</label>
              <div className="flex flex-wrap">
                {watchActivities.map((subActivity, index) => (
                  <label key={index} className="inline-flex items-center mr-4 mb-2">
                    <input
                      type="radio"
                      name="sub_activity"
                      value={subActivity}
                      checked={selectedSubActivity === subActivity}
                      onChange={(e) => setSelectedSubActivity(e.target.value)}
                      className="form-radio"
                    />
                    <span className="ml-2">{subActivity}</span>
                  </label>
                ))}
              </div>
            </div>
          )}
          <div className="mb-4">
            <label htmlFor="place" className="block text-lg font-semibold mb-2">場所</label>
            <div className="flex flex-wrap">
              {places.map((place, index) => (
                <label key={index} className="inline-flex items-center mr-4 mb-2">
                  <input
                    type="radio"
                    name="place"
                    value={place}
                    checked={selectedPlace === place}
                    onChange={(e) => setSelectedPlace(e.target.value)}
                    className="form-radio"
                  />
                  <span className="ml-2">{place}</span>
                </label>
              ))}
            </div>
          </div>
          <div className="mb-4">
            <label htmlFor="child_condition" className="block text-lg font-semibold mb-2">子供の気分</label>
            <div className="flex flex-wrap">
              {child_conditions.map((condition, index) => (
                <label key={index} className="inline-flex items-center mr-4 mb-2">
                  <input
                    type="radio"
                    name="child_condition"
                    value={condition}
                    checked={childCondition === condition}
                    onChange={(e) => setChildCondition(e.target.value)}
                    className="form-radio"
                  />
                  <span className="ml-2">{condition}</span>
                </label>
              ))}
            </div>
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
