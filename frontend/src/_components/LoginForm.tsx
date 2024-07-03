// src/_components/LoginForm.tsx

'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../hooks/useAuth';

const LoginForm: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string>('');
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const token = await login(email, password);
      localStorage.setItem('token', token); // トークンをローカルストレージに保存
      console.log('保存したトークン:', localStorage.getItem('token')); // ローカルストレージに保存したトークンをコンソールに出力
      router.push('/monthly-analysis'); // ログイン成功後にリダイレクト
    } catch (err: any) {
      setError(err.message || 'ログインに失敗しました。');
    }
  };

  return (
    <div className="p-6 bg-custom-green min-h-screen flex flex-col justify-center items-center">
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-sm"> {/* max-w-md を max-w-sm に変更 */}
        <h2 className="text-4xl font-bold mb-6 text-center">ログイン</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-lg font-semibold mb-2">メールアドレス</label>
            <input
              type="email"
              id="email"
              name="email"
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
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
          {error && <p className="text-red-500 text-center mb-4">{error}</p>}
          <button type="submit" className="w-full p-2 bg-custom-teal text-white rounded">ログイン</button>
        </form>
      </div>
    </div>
  );
};



export default LoginForm;
