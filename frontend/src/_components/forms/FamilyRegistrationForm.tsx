'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { auth } from '../../lib/firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import axios from 'axios';

const FamilyRegistrationForm: React.FC = () => {
  const [stakeholder_name, setStakeholderName] = useState<string>('');
  const [adult_name, setAdultName] = useState<string[]>(['']);
  const [child_name, setChildName] = useState<string[]>(['']);
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const router = useRouter();

  const handleAddChild = () => {
    setChildName([...child_name, '']);
  };

  const handleChildChange = (index: number, value: string) => {
    const newChild = [...child_name];
    newChild[index] = value;
    setChildName(newChild);
  };

  const handleAddAdult = () => {
    setAdultName([...adult_name, '']);
  };

  const handleAdultChange = (index: number, value: string) => {
    const newAdult = [...adult_name];
    newAdult[index] = value;
    setAdultName(newAdult);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Firebaseにユーザーを作成
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);

      // IDトークンを取得
      const idToken = await userCredential.user.getIdToken();

      // トークンをコンソールに表示
      console.log('ID Token:', idToken);

      // データベースに家族情報を送信
      await axios.post('http://localhost:8000/api/v1/user', 
        { 
          stakeholder_name,
          adult_name,
          child_name
        },
        {
          headers: {
            Authorization: `Bearer ${idToken}`,  // トークンをヘッダーに追加
          },
        }
      );

      alert('家族情報が登録されました！');
      setStakeholderName('');
      setAdultName(['']);
      setChildName(['']);
      setEmail('');
      setPassword('');
      router.push('/monthly-analysis'); // 登録後にリダイレクト
    } catch (error) {
      console.error('Error adding family: ', error);
      alert('エラーが発生しました。もう一度試してください。');
    }
  };

  return (
    <div className="p-6 bg-custom-green min-h-screen flex flex-col justify-center items-center">
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-4xl font-bold mb-6 text-center">家族の情報を登録</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="stakeholder_name" className="block text-lg font-semibold mb-2">家族の名前</label>
            <input
              type="text"
              id="stakeholder_name"
              value={stakeholder_name}
              onChange={(e) => setStakeholderName(e.target.value)}
              required
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="adult_name" className="block text-lg font-semibold mb-2">参加する大人の名前</label>
            {adult_name.map((name, index) => (
              <input
                key={index}
                type="text"
                id={`adult_name-${index}`}
                value={name}
                onChange={(e) => handleAdultChange(index, e.target.value)}
                required
                className="w-full p-2 border border-gray-300 rounded mb-2"
              />
            ))}
            <button
              type="button"
              onClick={handleAddAdult}
              className="w-full p-2 bg-custom-teal text-white rounded mt-2"
            >
              大人を追加
            </button>
          </div>
          <div className="mb-4">
            <label htmlFor="child_name" className="block text-lg font-semibold mb-2">子供の名前</label>
            {child_name.map((name, index) => (
              <input
                key={index}
                type="text"
                id={`child_name-${index}`}
                value={name}
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
          <div className="mb-4">
            <label htmlFor="email" className="block text-lg font-semibold mb-2">メールアドレス</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="password" className="block text-lg font-semibold mb-2">パスワード</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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
