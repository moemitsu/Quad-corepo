'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../../lib/firebase'; // Firebaseの初期化ファイルをインポート
import Link from 'next/link';

const ButtonHeader: React.FC = () => {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [user] = useAuthState(auth); // Firebase Authのユーザー状態を取得

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const closeMenu = () => {
    setMenuOpen(false);
  };

  const handleLogout = async () => {
    try {
      await auth.signOut(); // Firebaseでサインアウト
      router.push('/login'); // ログインページにリダイレクト
    } catch (error) {
      console.error('サインアウトに失敗しました:', error);
    }
  };

  return (
    <div className="relative inline-block text-left">
      <div>
        <button
          type="button"
          className="inline-flex w-full justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
          id="menu-button"
          aria-expanded={menuOpen}
          aria-haspopup="true"
          onClick={toggleMenu}
        >
          Menu
          <svg className="-mr-1 h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path
              fillRule="evenodd"
              d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </div>

      {menuOpen && (
        <div
          className="fixed right-0 z-50 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
          role="menu"
          aria-orientation="vertical"
          aria-labelledby="menu-button"
          tabIndex={-1}
        >
          <div className="py-1" role="none">
            <Link href="monthly-analysis" className="block px-4 py-2 text-sm text-gray-700" role="menuitem" tabIndex={-1} onClick={closeMenu}>
              記録を見る
            </Link>
          </div>
          <div className="py-1" role="none">
            <Link href="record-activity" className="block px-4 py-2 text-sm text-gray-700" role="menuitem" tabIndex={-1} onClick={closeMenu}>
              記録を追加する
            </Link>
            <Link href="#" className="block px-4 py-2 text-sm text-gray-700" role="menuitem" tabIndex={-1} onClick={closeMenu}>
              記録を変更する
            </Link>
          </div>
          <div className="py-1" role="none">
            <Link href="/family-registration" className="block px-4 py-2 text-sm text-gray-700" role="menuitem" tabIndex={-1} onClick={closeMenu}>
              登録情報の変更
            </Link>
            <Link href="/share" className="block px-4 py-2 text-sm text-gray-700" role="menuitem" tabIndex={-1} onClick={closeMenu}>
              家族で共有する
            </Link>
          </div>
          <div className="py-1" role="none">
            <Link href="#" className="block px-4 py-2 text-sm text-gray-700" role="menuitem" tabIndex={-1} onClick={closeMenu}>
              このアプリの使い方
            </Link>
            <Link href="#" className="block px-4 py-2 text-sm text-gray-700" role="menuitem" tabIndex={-1} onClick={closeMenu}>
              ヘルプ
            </Link>
          </div>
          <div className="py-1" role="none">
            <Link
              href="#"
              className="block px-4 py-2 text-sm text-gray-700"
              role="menuitem"
              tabIndex={-1}
              onClick={() => {
                handleLogout();
                closeMenu();
              }}
            >
              サインアウト
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default ButtonHeader;
