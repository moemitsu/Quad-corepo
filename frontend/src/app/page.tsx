'use client';
import { useEffect } from "react";
import { useRouter } from 'next/navigation';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../lib/firebase';
import Image from "next/image";
import Header from "../_components/layout/Header";
import Footer from "../_components/layout/Footer";
import Head from 'next/head';
import Introduction from "@/_components/layout/introduction";

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
      <main className="flex flex-col items-center justify-between relative">
        <div className="w-full h-[400px] sm:h-[500px] lg:h-[1000px] xl:h-[1400px] z-10 relative">
          <Image
            src="/index1.jpg"
            alt="Index Logo"
            layout="fill"
            objectFit="cover"
            priority
          />
        </div>
        <div className="absolute top-[8%] text-center text-white z-20 px-4">
          <div className="text-3xl font-bold text-custom-blue">
            共に過ごした「時間」が、家族の「絆」になる。
          </div>
          <div className="text-lg font-bold text-custom-blue mt-6">
            <p>今、この時を、笑顔で過ごしたい。</p>
            <p>家族と過ごす時間を記録、分析、サポートします。</p>
          </div>
        </div>
        <div className="text-xl font-bold text-custom-blue mt-6">
            家族の時間を可視化・分析するアプリ「corepo -これぽ-」
          </div>
        <div className="flex items-center justify-center mt-6">
            <button
              className="px-6 py-3 bg-custom-teal text-md text-white rounded-full shadow-md hover:bg-custom-blue transition-colors"
              onClick={handleButtonClick} >
              使ってみる
            </button>
          </div>
       <Introduction />
       <div className="text-lg font-bold text-custom-blue mt-6">
            家族の時間を可視化・分析するアプリ「corepo -これぽ-」
          </div>
        <div className="flex items-center justify-center mt-6">
            <button
              className="px-6 py-3 bg-custom-teal text-md text-white rounded-full shadow-md hover:bg-custom-blue transition-colors"
              onClick={handleButtonClick} >
              使ってみる
            </button>
          </div>
      </main>
      <Footer />
    </div>
  );
}
