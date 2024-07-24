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
        <div className="w-full h-[400px] sm:h-[600px] lg:h-[700px] xl:h-[900px] 2xl:h-[1200px] z-10 relative">
          <Image
            src="/index2.jpg"
            alt="Index Logo"
            layout="fill"
            objectFit="cover"
            priority
          />
        </div>
        <div className="absolute sm:top-[8%] md:top-[12%] xl:top-[17%] 2xl:top-[20%] left-2 xl:left-12 2xl:left-16 3xl:left-20 text-left text-white z-20 px-4">
          <div className="md:text-xl xl:text-3xl 2xl:text-3xl 3xl:text-5xl font-bold text-custom-blue">
            共に過ごした「時間」が、家族の「絆」になる。
          </div>
          <div className="text-lg font-bold text-custom-blue mt-6">
            <p>今、この時を、笑顔で過ごしたい。</p>
            <p>家族と過ごす時間を記録、分析、サポートします。</p>
          </div>
          {/* <div className="left-40">
            <Image
              src="/PCimage.png"
              alt="PC"
              objectFit="cover"
              width={350}
              height={350}
              priority
            />
          </div> */}
        </div>
        <div className="text-2xl font-bold text-custom-blue mt-8">
          家族の時間を可視化・分析するアプリ「corepo -これぽ-」
        </div>
        <div className="flex items-center justify-center mt-8">
          <button
            className="px-28 py-3 bg-custom-teal text-xl text-white rounded-full shadow-md hover:bg-custom-blue transition-colors"
            onClick={handleButtonClick}
          >
            使ってみる
          </button>
        </div>
        <Introduction />
        <div className="text-lg font-bold text-custom-blue mt-6">
          家族の時間を可視化・分析するアプリ「corepo -これぽ-」
        </div>
        <div className="flex items-center justify-center mt-8">
          <button
            className="px-28 py-3 bg-custom-teal text-xl text-white rounded-full shadow-md hover:bg-custom-blue transition-colors"
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
