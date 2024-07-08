"use client";
import Image from "next/image";
import Header from "../_components/layout/header";
import Footer from "../_components/layout/footer";
import { useRouter } from 'next/navigation';




export default function Home() {
  const router = useRouter();
  return (
    <div>
      <Header />
      <main className="flex min-h-screen flex-col items-center justify-between p-24">
        <Image
          className="relative dark:drop-shadow-[0_0_0.3rem_#ffffff70] dark:invert"
          src="/index.jpg"
          alt="Index Logo"
          width={900}
          height={120}
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
            onClick={() => router.push("/login")}
          >
            使ってみる／ログイン
          </button>
        </div>
      </main>
      <Footer />
    </div>
  );
}
