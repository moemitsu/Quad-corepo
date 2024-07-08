'use client'
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../../lib/firebase'; // Firebaseの初期化ファイルをインポート
import ButtonHeader from './ButtonHeader';
import Image from 'next/image';

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
    <header className="flex flex-wrap sm:justify-start sm:flex-nowrap w-full bg-white text-sm py-4 dark:bg-neutral-800 shadow-md">
      <nav className="max-w-[85rem] w-full mx-auto px-4 sm:flex sm:items-center sm:justify-between" aria-label="Global">
        <div className="flex items-center justify-between w-full">
          <a className="flex items-center text-8xl text-custom-blue font-semibold dark:text-white mr-auto" href="/">
            <Image src="/LogoIcon.svg" alt="Logo" width={320} height={120} className="mr-2" />   
          </a>
        </div>
        <div
          id="navbar-collapse-with-animation"
          className={`hs-collapse hidden overflow-hidden transition-all duration-300 basis-full grow sm:block ${menuOpen ? 'block' : 'hidden'}`}
        >
          <div className="text-xl flex flex-col gap-6 mt-6 sm:flex-row sm:items-center sm:justify-end sm:mt-0 sm:ps-5">
            
            {user ? (
              <>
                <ButtonHeader />
              </>
            ) : (
              <>
              <a className="font-medium text-gray-600 hover:text-gray-400 dark:text-neutral-400 dark:hover:text-neutral-500" href="#">
                  アプリの使い方
                </a>
                <a
                  className="font-medium text-gray-600 hover:text-gray-400 dark:text-neutral-400 dark:hover:text-neutral-500"
                  href="#"
                  onClick={handleLogin}
                >
                    ログイン
                  </a></>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
