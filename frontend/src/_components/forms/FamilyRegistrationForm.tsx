'use client';

import React, { useState } from 'react';
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

  const handleAddChild = () => {
    setChildNames([...childNames, '']);
  };

  const handleChildChange = (index: number, value: string) => {
    const newChildNames = [...childNames];
    newChildNames[index] = value;
    setChildNames(newChildNames);
  };

  const handleAddAdult = () => {
    setAdultNames([...adultNames, '']);
  };

  const handleAdultChange = (index: number, value: string) => {
    const newAdultNames = [...adultNames];
    newAdultNames[index] = value;
    setAdultNames(newAdultNames);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // パスワードの長さをチェック
    if (password.length < 6) {
      setError('パスワードは6文字以上でなければなりません。');
      return;
    }

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
          stakeholder_name: stakeholderName,
          adult_name: adultNames,
          child_name: childNames
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
      console.error('Error adding family: ', error);
      setError('エラーが発生しました。もう一度試してください。');
    }
  };

  return (
    <div className="p-6 min-h-screen flex flex-col justify-center items-center">
      <div className="p-6 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-4xl font-bold mb-6 text-center text-custom-blue">家族の情報を登録</h2>
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
          <div className="mb-4">
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
          <button type="submit" className="w-full p-2 bg-custom-teal text-white rounded">登録</button>
        </form>
      </div>
    </div>
  );
};

export default FamilyRegistrationForm;
