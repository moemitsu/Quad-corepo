// app/_components/layout/Introduction.tsx
'use client'
import { FC } from 'react';
import { useRouter } from 'next/navigation';

const Introduction: FC = () => {
  const router = useRouter();

  const handleButtonClick = () => {
    router.push('/monthly-analysis'); // クリック時に月次分析ページに遷移
  };

  return (
    <section className="p-8 lg:p-16 dark:bg-gray-100 dark:text-gray-800">
      <div className="container mx-auto space-y-12">
        <div className="flex flex-col overflow-hidden rounded-md shadow-sm lg:flex-row">
          <img
            src="Record1.png"
            alt=""
            className="h-80 dark:bg-gray-500 aspect-video"
          />
          <div className="flex flex-col justify-center flex-1 p-10 dark:bg-gray-50 text-custom-blue">
            <span className="text-xs uppercase dark:text-gray-600">活動を残す</span>
            <h3 className="text-3xl font-bold">過ごした時間を記録</h3>
            <p className="my-6 dark:text-gray-600">
              誰とどんな活動（過ごし方）をしたか、ごきげん度などを記録します。
            </p>
          </div>
        </div>
        <div className="flex flex-col overflow-hidden rounded-md shadow-sm lg:flex-row-reverse">
          <img
            src="Chart2.png"
            alt=""
            className="h-80 dark:bg-gray-500 aspect-video"
          />
          <div className="flex flex-col justify-center flex-1 p-6 dark:bg-gray-50 text-custom-blue">
            <span className="text-xs uppercase dark:text-gray-600">時間を可視化</span>
            <h3 className="text-3xl font-bold">過ごした時間をグラフ化</h3>
            <p className="my-6 dark:text-gray-600">
            月別に記録データを集計。時間の割合が一目で分かります。
            </p>
          </div>
        </div>
        <div className="flex flex-col overflow-hidden rounded-md shadow-sm lg:flex-row">
          <img
            src="LLM応答.png"
            alt=""
            className="h-80 dark:bg-gray-500 aspect-video"
          />
          <div className="flex flex-col justify-center flex-1 p-6 dark:bg-gray-50 text-custom-blue">
            <span className="text-xs uppercase dark:text-gray-600">プランの提案</span>
            <h3 className="text-3xl font-bold">AIによる分析と提案</h3>
            <p className="my-6 dark:text-gray-600">
            家族が喜ぶ、最適な過ごし方をご提案（※）。
            </p>
            <button type="button" className="self-start text-sm" onClick={handleButtonClick}>
              <p>※3回まで無料お試しが可能。</p>
              <p>800円/月でアドバイス受け放題プランに加入できます。</p>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Introduction;
