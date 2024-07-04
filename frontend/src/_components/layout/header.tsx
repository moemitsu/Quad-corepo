// src/_components/Header.tsx
'use client'
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../../firebase'; // Firebaseの初期化ファイルをインポート

const Header: React.FC = () => {
  const router = useRouter();
  const [user] = useAuthState(auth); // Firebase Authのユーザー状態を取得
  const [menuOpen, setMenuOpen] = useState(false); // メニューの開閉状態を管理

  const handleLogout = async () => {
    try {
      await auth.signOut();
      router.push('/login'); // ログアウト後にログインページにリダイレクト
    } catch (error) {
      console.error('ログアウトに失敗しました:', error);
    }
  };

  const handleLogin = () => {
    router.push('/login'); // ログインページにリダイレクト
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen); // メニューの開閉状態を反転させる
  };

  return (
    <div className="relative bg-white text-custom-blue p-4 shadow-header">
      <div className="flex items-center justify-between">
        <h1 className="text-7xl">
          <img src="/corepo.png" alt="corepoIcon" className="w-30 h-41" />
        </h1>
        <div className="relative">
          <img
            src='/menuicon.png'
            alt="Menu Icon"
            className="cursor-pointer w-5 h-5"
            onClick={toggleMenu}
          />
          {menuOpen && (
            <div className="absolute right-0 mt-2 py-2 w-96 bg-white rounded-lg shadow-xl">
              <button
                className="block px-4 py-2 text-custom-blue text-xl hover:bg-gray-200 w-full text-left"
                onClick={() => router.push('/help')}
              >
                ヘルプ
              </button>
              {user ? (
                <button
                  className="block px-4 py-2 text-custom-blue text-xl hover:bg-gray-200 w-full text-left"
                  onClick={handleLogout}
                >
                  ログアウト
                </button>
              ) : (
                <button
                  className="block px-4 py-2 text-custom-blue text-xl hover:bg-gray-200 w-full text-left"
                  onClick={handleLogin}
                >
                  ログイン
                </button>
              )}
              <button
                className="block px-4 py-2 text-custom-blue text-xl hover:bg-gray-200 w-full text-left"
                onClick={() => router.push('/register')}
              >
                登録情報
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Header;
