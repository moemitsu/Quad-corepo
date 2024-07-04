'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { auth } from '../../lib/firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import axios from 'axios';

const FamilyRegistrationForm: React.FC = () => {
  const [stakeholder_name, setStakeholderName] = useState<string>('');
  const [adalt_name, setAdaltName] = useState<string[]>(['']);
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

  const handleAddAdalt = () => {
    setAdaltName([...adalt_name, '']);
  };

  const handleAdaltChange = (index: number, value: string) => {
    const newAdalt = [...adalt_name];
    newAdalt[index] = value;
    setAdaltName(newAdalt);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Firebaseにユーザーを作成
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);

      // UIDを取得し、firebase_idとしてバックエンドに送信
      const firebase_id = userCredential.user.uid;

      // IDトークンを取得
      const idToken = await userCredential.user.getIdToken();

      // UIDとトークンをコンソールに表示
      console.log('UID:', firebase_id);
      console.log('ID Token:', idToken);

      // データベースに家族情報を送信
      await axios.post('http://localhost:8000/api/v1/user', 
        { 
          stakeholder_name,
          adalt_name,
          child_name,
          firebase_id,  // UIDをfirebase_idとしてバックエンドに渡す
        },
        {
          headers: {
            Authorization: `Bearer ${idToken}`,  // トークンをヘッダーに追加
          },
        }
      );

      alert('家族情報が登録されました！');
      setStakeholderName('');
      setAdaltName(['']);
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
            <label htmlFor="adalt_name" className="block text-lg font-semibold mb-2">参加する大人の名前</label>
            {adalt_name.map((adaltName, index) => (
              <input
                key={index}
                type="text"
                id={`adalt_name-${index}`}
                value={adaltName}
                onChange={(e) => handleAdaltChange(index, e.target.value)}
                required
                className="w-full p-2 border border-gray-300 rounded mb-2"
              />
            ))}
            <button
              type="button"
              onClick={handleAddAdalt}
              className="w-full p-2 bg-custom-teal text-white rounded mt-2"
            >
              大人を追加
            </button>
          </div>
          <div className="mb-4">
            <label htmlFor="child_name" className="block text-lg font-semibold mb-2">子供の名前</label>
            {child_name.map((childName, index) => (
              <input
                key={index}
                type="text"
                id={`child_name-${index}`}
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
