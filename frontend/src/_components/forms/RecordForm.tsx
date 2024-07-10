'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../hooks/useAuth';

const RecordForm: React.FC = () => {
  const { user } = useAuth();
  const events = ['遊び', '生活（食事・お風呂・寝かしつけ、など）', '見守り（勉強・習い事、など）'];
  const places = ['家', '屋内', '戸外', '保育園・幼稚園', 'その他'];
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
  const [children, setChildren] = useState<string[]>([]);
  const [withMembers, setWithMembers] = useState<string[]>([]);

  useEffect(() => {
    const fetchChildrenAndWithMembers = async () => {
      try {
        if (!user) {
          throw new Error('ユーザーが認証されていません。');
        }

        const token = await user.getIdToken();

        const childrenResponse = await axios.get('http://localhost:8000/api/v1/user/{user_id}/child_name', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setChildren(childrenResponse.data.children);

        const withMembersResponse = await axios.get('http://localhost:8000/api/v1/stakeholders/{stakeholder_id}/adult_name', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setWithMembers(withMembersResponse.data.with_members);
      } catch (error) {
        console.error('データ取得エラー: ', error);
      }
    };

    fetchChildrenAndWithMembers();
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (!user) {
        throw new Error('ユーザーが認証されていません。');
      }

      const token = await user.getIdToken();

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
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      alert('活動が記録されました！');
      console.log('Response:', response.data);
    } catch (error) {
      console.error('ドキュメント追加エラー: ', error);
      alert('エラーが発生しました。もう一度試してください。');
    }
  };

  return (
    <div className="p-6 min-h-screen flex flex-col justify-center items-center">
      <div className="p-6 rounded-lg shadow-md w-full max-w-2xl bg-white">
        <h2 className="text-4xl font-bold mb-6 text-center">活動の記録</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="with_member" className="block text-lg font-semibold mb-2">保護者の名前</label>
            <div className="flex space-x-4">
              {withMembers.map((member, index) => (
                <label key={index} className="inline-flex items-center">
                  <input
                    type="radio"
                    name="with_member"
                    value={member}
                    checked={selectedWithMember === member}
                    onChange={(e) => setSelectedWithMember(e.target.value)}
                    className="form-radio"
                  />
                  <span className="ml-2">{member}</span>
                </label>
              ))}
            </div>
          </div>
          <div className="mb-4">
            <label htmlFor="child" className="block text-lg font-semibold mb-2">子供の名前</label>
            <div className="flex space-x-4">
              {children.map((child, index) => (
                <label key={index} className="inline-flex items-center">
                  <input
                    type="radio"
                    name="child"
                    value={child}
                    checked={selectedChild === child}
                    onChange={(e) => setSelectedChild(e.target.value)}
                    className="form-radio"
                  />
                  <span className="ml-2">{child}</span>
                </label>
              ))}
            </div>
          </div>
          <div className="mb-4">
            <label htmlFor="events" className="block text-lg font-semibold mb-2">どんなこと</label>
            <div className="flex flex-wrap space-x-4">
              {events.map((event, index) => (
                <label key={index} className="inline-flex items-center mb-2">
                  <input
                    type="radio"
                    name="event"
                    value={event}
                    checked={selectedEvent === event}
                    onChange={(e) => setSelectedEvent(e.target.value)}
                    className="form-radio"
                  />
                  <span className="ml-2">{event}</span>
                </label>
              ))}
            </div>
          </div>
          <div className="mb-4">
            <label htmlFor="place" className="block text-lg font-semibold mb-2">場所</label>
            <div className="flex space-x-4">
              {places.map((place, index) => (
                <label key={index} className="inline-flex items-center">
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
            <div className="flex space-x-4">
              {child_conditions.map((condition, index) => (
                <label key={index} className="inline-flex items-center">
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

export default RecordForm;