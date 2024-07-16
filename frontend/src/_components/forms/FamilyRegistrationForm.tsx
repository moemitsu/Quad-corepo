'use client';

import React, { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { auth } from '../../lib/firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import axios from 'axios';

const FamilyRegistrationForm: React.FC = () => {
  const [stakeholderName, setStakeholderName] = useState<string>('');
  const [adultNames, setAdultNames] = useState<string[]>(['']);
  const [childNames, setChildNames] = useState<string[]>(['']);
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string>('');
  const router = useRouter();

  const handleAddChild = useCallback(() => {
    setChildNames([...childNames, '']);
  }, [childNames]);

  const handleChildChange = useCallback((index: number, value: string) => {
    const newChildNames = [...childNames];
    newChildNames[index] = value;
    setChildNames(newChildNames);
  }, [childNames]);

  const handleAddAdult = useCallback(() => {
    setAdultNames([...adultNames, '']);
  }, [adultNames]);

  const handleAdultChange = useCallback((index: number, value: string) => {
    const newAdultNames = [...adultNames];
    newAdultNames[index] = value;
    setAdultNames(newAdultNames);
  }, [adultNames]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // パスワードの長さをチェック
    if (password.length < 6) {
      setError('パスワードは6文字以上でなければなりません。');
      return;
    }

    try {
      // エラーメッセージをクリア
      setError('');

      // Firebaseにユーザーを作成
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);

      // IDトークンを取得
      const idToken = await userCredential.user.getIdToken();

      // トークンをコンソールに表示
      console.log('ID Token:', idToken);

      // データベースに家族情報を送信
      const response = await axios.post('http://localhost:8000/api/v1/user', 
        { 
          stakeholder_name: stakeholderName,
          adult_names: adultNames,
          child_names: childNames
        },
        {
          headers: {
            Authorization: `Bearer ${idToken}`,  // トークンをヘッダーに追加
          },
        }
      );

      alert('家族情報が登録されました！');
      setStakeholderName('');
      setAdultNames(['']);
      setChildNames(['']);
      setEmail('');
      setPassword('');
      router.push('/monthly-analysis'); // 登録後にリダイレクト
    } catch (error: any) {
      console.error('Error adding family: ', error.response ? error.response.data : error.message);
      if (error.response) {
        console.error('Error response data:', error.response.data);
        console.error('Error response status:', error.response.status);
        console.error('Error response headers:', error.response.headers);
      } else if (error.request) {
        console.error('Error request:', error.request);
      } else {
        console.error('Error message:', error.message);
      }
      setError('エラーが発生しました。もう一度試してください。');
    }
  };


  return (
    <div className="p-16 min-h-screen flex flex-col justify-start items-center pt-28">
      <div className="p-6 bg-white rounded-lg shadow-md w-full max-w-3xl">
        <h2 className="text-4xl font-bold mb-6 text-center text-custom-blue">アカウントを作成</h2>
        <p className="text-sm text-center text-gray-500 mb-10">メールアドレス、パスワード、家族情報を入力してください</p>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-lg font-semibold mb-2 text-custom-blue">メールアドレス</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
          <div className="mb-8">
            <label htmlFor="password" className="block text-lg font-semibold mb-2 text-custom-blue">パスワード <span className="text-sm text-gray-500">(半角英数6文字以上)</span></label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="stakeholderName" className="block text-lg font-semibold mb-2 text-custom-blue">家族の名前</label>
            <input
              type="text"
              id="stakeholderName"
              value={stakeholderName}
              onChange={(e) => setStakeholderName(e.target.value)}
              required
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="adultName" className="block text-lg font-semibold mb-2 text-custom-blue">参加する大人の名前</label>
            {adultNames.map((name, index) => (
              <input
                key={index}
                type="text"
                id={`adultName-${index}`}
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
            <label htmlFor="childName" className="block text-lg font-semibold mb-2 text-custom-blue">子供の名前</label>
            {childNames.map((name, index) => (
              <input
                key={index}
                type="text"
                id={`childName-${index}`}
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
          {error && <p className="text-red-500 text-center mb-4">{error}</p>}
          <button type="submit" className="w-full p-3 bg-custom-teal text-white rounded">登録</button>
        </form>
      </div>
    </div>
  );
};

export default FamilyRegistrationForm;
