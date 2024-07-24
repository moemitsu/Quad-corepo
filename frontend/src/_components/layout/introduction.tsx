'use client'
import { FC } from 'react';
import { useRouter } from 'next/navigation';

const Introduction: FC = () => {
  const router = useRouter();

  const handleButtonClick = () => {
    router.push('/monthly-analysis'); // クリック時に月次分析ページに遷移
  };

  return (
    <section className="p-10 lg:p-16 xl:p-20 2xl:p-24 dark:bg-gray-100 dark:text-gray-800">
      <div className="container mx-auto space-y-12">
        <div className="flex flex-col overflow-hidden rounded-md shadow-sm lg:flex-row">
          <img
            src="Record1.png"
            alt=""
            className="h-80 xl:h-96 2xl:h-[28rem] dark:bg-gray-500 aspect-video"
          />
          <div className="flex flex-col justify-center flex-1 p-10 xl:p-12 2xl:p-16 dark:bg-gray-50 text-custom-blue">
            <span className="text-xs xl:text-sm 2xl:text-base uppercase dark:text-gray-600">活動を残す</span>
            <h3 className="text-3xl xl:text-4xl 2xl:text-5xl font-bold">過ごした時間を記録</h3>
            <p className="my-6 xl:my-8 2xl:my-10 dark:text-gray-600">
              誰と、どのような活動（過ごし方）をしたか、ごきげん度などを記録します。
            </p>
          </div>
        </div>
        <div className="flex flex-col overflow-hidden rounded-md shadow-sm lg:flex-row-reverse">
          <img
            src="Chart3.png"
            alt=""
            className="h-80 xl:h-96 2xl:h-[28rem] dark:bg-gray-500 aspect-video"
          />
          <div className="flex flex-col justify-center flex-1 p-6 xl:p-12 2xl:p-16 dark:bg-gray-50 text-custom-blue">
            <span className="text-xs xl:text-sm 2xl:text-base uppercase dark:text-gray-600">時間を可視化</span>
            <h3 className="text-3xl xl:text-4xl 2xl:text-5xl font-bold">過ごした時間をグラフ化</h3>
            <p className="my-6 xl:my-8 2xl:my-10 dark:text-gray-600">
              月別に記録データを集計。時間の割合が一目で分かります。
            </p>
          </div>
        </div>
        <div className="flex flex-col overflow-hidden rounded-md shadow-sm lg:flex-row">
          <img
            src="LLM応答1.png"
            alt=""
            className="h-80 xl:h-96 2xl:h-[28rem] dark:bg-gray-500 aspect-video"
          />
          <div className="flex flex-col justify-center flex-1 p-6 xl:p-12 2xl:p-16 dark:bg-gray-50 text-custom-blue">
            <span className="text-xs xl:text-sm 2xl:text-base uppercase dark:text-gray-600">プランの提案</span>
            <h3 className="text-3xl xl:text-4xl 2xl:text-5xl font-bold">AIによる分析と提案</h3>
            <p className="my-6 xl:my-8 2xl:my-10 dark:text-gray-600">
              家族が喜ぶ、最適な過ごし方をご提案します（※）。
            </p>
            <button type="button" className="self-start text-sm xl:text-base 2xl:text-lg" onClick={handleButtonClick}>
              <p>※3回まで無料お試しが可能。</p>
              <p>800円/月でAI分析使い放題プランに加入できます。</p>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Introduction;
