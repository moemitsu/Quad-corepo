'use client';

import React, { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

const FamilyRegistrationForm: React.FC = () => {
  const [name, setName] = useState<string>('');
  const [child, setChild] = useState<string[]>(['']);
  const router = useRouter();
  
  const handleAddChild = () => {
    setChild([...child, '']);
  };

  const handleChildChange = (index: number, value: string) => {
    const newChild = [...child];
    newChild[index] = value;
    setChild(newChild);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await axios.post('http://localhost:8000/api/v1/user', { 
        name,
        child,
      });
      alert('家族情報が登録されました！');
      setName('');
      setChild(['']);
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
            <label htmlFor="name" className="block text-lg font-semibold mb-2">家族の名前</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="child" className="block text-lg font-semibold mb-2">子供の名前</label>
            {child.map((childName, index) => (
              <input
                key={index}
                type="text"
                id={`child-${index}`}
                value={childName}
                onChange={(e) => handleChildChange(index, e.target.value)}
                required
                className="w-full p-2 border border-gray-300 rounded mb-2"
              />
            ))}
            <button
              type="button"
              onClick={handleAddChild}
              className="w-full p-2 bg-custom-teal text-white rounded mt-2"
            >
              子供を追加
            </button>
          </div>
          <button type="submit" className="w-full p-2 bg-custom-teal text-white rounded">登録</button>
        </form>
      </div>
    </div>
  );
};

export default FamilyRegistrationForm;
