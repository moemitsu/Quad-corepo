// src/_components/FamilyRegistrationForm.tsx

'use client';

import React, { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

const FamilyRegistrationForm: React.FC = () => {
  const [familyName, setFamilyName] = useState<string>('');
  const [parentName, setParentName] = useState<string>('');
  const [childName, setChildName] = useState<string>('');
  const router = useRouter();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await axios.post('http://localhost:8000/families', {
        familyName,
        parentName,
        childName,
      });
      alert('家族情報が登録されました！');
      setFamilyName('');
      setParentName('');
      setChildName('');
      router.push('/monthly-analysis'); // 登録後にリダイレクト
    } catch (error) {
      console.error('Error adding family: ', error);
      alert('エラーが発生しました。もう一度試してください。');
    }
  };

  return (
    <div className="p-6 bg-custom-green min-h-screen flex flex-col justify-center items-center">
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-4xl font-bold mb-6 text-center">家族の情報登録</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="familyName" className="block text-lg font-semibold mb-2">家族の名前</label>
            <input
              type="text"
              id="familyName"
              value={familyName}
              onChange={(e) => setFamilyName(e.target.value)}
              required
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="parentName" className="block text-lg font-semibold mb-2">保護者の名前</label>
            <input
              type="text"
              id="parentName"
              value={parentName}
              onChange={(e) => setParentName(e.target.value)}
              required
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="childName" className="block text-lg font-semibold mb-2">子供の名前</label>
            <input
              type="text"
              id="childName"
              value={childName}
              onChange={(e) => setChildName(e.target.value)}
              required
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
          <button type="submit" className="w-full p-2 bg-custom-teal text-white rounded">登録</button>
        </form>
      </div>
    </div>
  );
};

export default FamilyRegistrationForm;
