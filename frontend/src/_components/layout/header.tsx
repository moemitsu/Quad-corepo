import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../../lib/firebase'; // Firebaseの初期化ファイルをインポート
import MenuIcon from 'feather-icons-react';
import ButtonHeader from './ButtonHeader';

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
    <header className="flex flex-wrap sm:justify-start sm:flex-nowrap w-full bg-white text-sm py-4 dark:bg-neutral-800">
      <nav className="max-w-[85rem] w-full mx-auto px-4 sm:flex sm:items-center sm:justify-between" aria-label="Global">
        <div className="flex items-center justify-between w-full">
          <a className="flex-none text-8xl text-custom-blue font-semibold dark:text-white mr-auto" href="/">corepo</a>
          <div className="sm:hidden">
            <button
              type="button"
              className="hs-collapse-toggle p-2 inline-flex justify-center items-center gap-x-2 rounded-lg border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-transparent dark:border-neutral-700 dark:text-white dark:hover:bg-white/10"
              data-hs-collapse="#navbar-collapse-with-animation"
              aria-controls="navbar-collapse-with-animation"
              aria-label="Toggle navigation"
              onClick={toggleMenu}
            >
              <MenuIcon className={`hs-collapse-open:hidden flex-shrink-0 size-4 ${menuOpen ? 'hidden' : 'block'}`} icon={''} />
              <MenuIcon className={`hs-collapse-open:block hidden flex-shrink-0 size-4 ${menuOpen ? 'block' : 'hidden'}`} icon={''} />
            </button>
          </div>
        </div>
        <div
          id="navbar-collapse-with-animation"
          className={`hs-collapse hidden overflow-hidden transition-all duration-300 basis-full grow sm:block ${menuOpen ? 'block' : 'hidden'}`}
        >
          <div className="text-2xl flex flex-col gap-6 mt-6 sm:flex-row sm:items-center sm:justify-end sm:mt-0 sm:ps-5">
            {user ? (
              <a
                className="font-medium text-gray-600 hover:text-gray-400 dark:text-neutral-400 dark:hover:text-neutral-500"
                href="#"
                onClick={handleLogout}
              >
                ログアウト
              </a>
            ) : (
              <a
                className="font-medium text-gray-600 hover:text-gray-400 dark:text-neutral-400 dark:hover:text-neutral-500"
                href="#"
                onClick={handleLogin}
              >
                ログイン
              </a>
            )}
            <a className="font-medium text-gray-600 hover:text-gray-400 dark:text-neutral-400 dark:hover:text-neutral-500" href="/family-registration">登録情報</a>
            <a className="font-medium text-gray-600 hover:text-gray-400 dark:text-neutral-400 dark:hover:text-neutral-500" href="#">ヘルプ</a>
            <ButtonHeader />
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
