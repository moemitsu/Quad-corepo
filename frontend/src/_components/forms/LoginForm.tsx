'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../hooks/useAuth';

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

      await login(email, password);
      // ログイン成功後にリダイレクト
      router.push('/monthly-analysis');

    } catch (err: any) {
      console.error('エラーコード:', err.code);
      console.error('エラーメッセージ:', err.message);
      setError('メールまたはパスワードが違います。ご確認の上、再度ログインをお試しください');
    }
  };

  const handleRegister = () => {
    // 会員登録ページにリダイレクト
    router.push('/family-registration');
  };

  return (
    <div className="p-6 min-h-screen flex flex-col justify-center items-center">
      <div className="p-6 rounded-lg shadow-md w-full max-w-sm">
        <h2 className="text-4xl font-bold mb-6 text-center text-custom-blue">ログイン</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-lg font-semibold mb-2 text-custom-blue">メールアドレス</label>
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
            <label htmlFor="password" className="block text-lg font-semibold mb-2 text-custom-blue">
              パスワード <span className="text-sm text-gray-500">(半角6文字以上)</span>
            </label>
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
          <button type="submit" className="w-full p-2 bg-custom-teal text-white rounded mb-4">ログイン</button>
        </form>
        <p className="text-center mb-2 text-custom-blue">アカウントをお持ちでない方</p>
        <button onClick={handleRegister} className="w-full p-2 bg-custom-teal text-white rounded">会員登録</button>
      </div>
    </div>
  );
};

export default LoginForm;
