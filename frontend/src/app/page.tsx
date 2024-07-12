'use client';
import { useEffect } from "react";
import { useRouter } from 'next/navigation';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../lib/firebase';
import Image from "next/image";
import Header from "../_components/layout/Header";
import Footer from "../_components/layout/Footer";
import Head from 'next/head';

export default function Home() {
  const router = useRouter();
  const [user, loading, error] = useAuthState(auth);

  const handleButtonClick = () => {
    if (loading) {
      // ローディング中は何もしない
      return;
    }
    if (user) {
      // ユーザーが認証済みの場合は、グラフやLLM分析結果のページにリダイレクト
      router.push('/monthly-analysis');
    } else {
      // ユーザーが認証されていない場合は、ログインページにリダイレクト
      router.push('/login');
    }
  };

  return (
    <div>
      <Head>
        <title>corepo -これぽ-</title>
      </Head>
      <Header />
      <main className="flex min-h-screen flex-col items-center justify-between p-24">
        <Image
          className="relative dark:drop-shadow-[0_0_0.3rem_#ffffff70] dark:invert"
          src="/index1.jpg"
          alt="Index Logo"
          width={1200}
          height={160}
          priority
        />
        <div className="text-2xl text-custom-blue ">
          共に過ごした「時間」が、家族の「絆」になる
        </div>
        <div className="text-xl text-custom-blue ">
          家族の時間を可視化・分析するアプリ「corepo -これぽ-」
        </div>
        <div className="flex items-center mt-4">
          <button
            className="px-6 py-3 bg-custom-teal text-md text-white rounded-full shadow-md hover:bg-custom-blue transition-colors"
            onClick={handleButtonClick}
          >
            使ってみる
          </button>
        </div>
      </main>
      <Footer />
    </div>
  );
}
