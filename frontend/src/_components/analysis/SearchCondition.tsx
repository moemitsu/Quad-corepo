'use client'
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import dynamic from 'next/dynamic';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { useRouter } from "next/navigation";

interface SearchConditionProps {
  setSelectedYear: React.Dispatch<React.SetStateAction<number>>;
  setSelectedMonth: React.Dispatch<React.SetStateAction<number>>;
  setSelectedChild: React.Dispatch<React.SetStateAction<string>>;
}

const SearchCondition: React.FC<SearchConditionProps> = ({
  setSelectedYear,
  setSelectedMonth,
  setSelectedChild,
}) => {
  const [children, setChildren] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false);
  const auth = getAuth();
  const router = useRouter(); 
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1; // JavaScriptの月は0から始まるため

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const token = await getAuthToken();
          fetchChildren(token);
        } catch (error) {
          setError("認証エラーが発生しました。");
        }
      } else {
        setError("ユーザーが認証されていません。");
      }
    });

    return () => unsubscribe();
  }, [auth]);

  useEffect(() => {
    setIsClient(true);
    setSelectedYear(currentYear); // 初期設定
    setSelectedMonth(currentMonth); // 初期設定
  }, []);

  const fetchChildren = async (token: string) => {
    try {
      const response = await axios.get("http://localhost:8000/api/v1/names", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const childNames = response.data.child_names.filter((name: string) => name !== "");
      setChildren(childNames);
      setError(null);
    } catch (error) {
      console.error("子供の名前を取得できませんでした。", error);
      setError("お子様の名前を取得できませんでした。");
    }
  };

  const getAuthToken = async () => {
    try {
      const user = auth.currentUser;
      if (user) {
        return await user.getIdToken(/* forceRefresh */ true);
      } else {
        throw new Error("ユーザーがログインしていません。");
      }
    } catch (error) {
      console.error("認証トークンを取得できませんでした。", error);
      throw error;
    }
  };

  if (!isClient) {
    return null;
  }

  return (
    <div className="mt-40 bg-white bg-opacity-50 p-6 rounded-lg shadow-md">
      分析したい年月とお子様を選択してください
      <div className="flex items-center justify-between mt-6">
        <div className="relative flex items-center space-x-4">
          <select
            className="p-4 text-xl text-custom-blue bg-custom-light-green shadow-inner"
            onChange={(e) => setSelectedYear(parseInt(e.target.value))}
            defaultValue={currentYear} // 初期設定
          >
            {Array.from({ length: 1 }, (_, i) => (
              <option key={new Date().getFullYear() - i} value={new Date().getFullYear() - i}>
                {new Date().getFullYear() - i}年
              </option>
            ))}
          </select>
          <select
            className="p-4 text-xl text-custom-blue bg-custom-light-green shadow-inner"
            onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
            defaultValue={currentMonth} // 初期設定
          >
            {Array.from({ length: 12 }, (_, i) => (
              <option key={i + 1} value={i + 1}>
                {i + 1}月
              </option>
            ))}
          </select>
          <select
            className="p-4 text-md text-custom-blue bg-custom-light-green shadow-inner"
            onChange={(e) => setSelectedChild(e.target.value)}
          >
            <option value="">お子様を選択</option>
            {children.map((child, index) => (
              <option key={index} value={child}>
                {child}
              </option>
            ))}
          </select>
        </div>
        <div className="flex items-center">
          <button
            className="p-2 bg-custom-teal text-md text-white rounded shadow-md hover:bg-custom-blue transition-colors"
            onClick={() => router.push("/record-activity")}
          >
            記録を追加する
          </button>
        </div>
      </div>
      {error && (
        <div
          className="mt-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
          role="alert"
        >
          <strong className="font-bold">エラー:</strong>
          <span className="block sm:inline"> {error}</span>
        </div>
      )}
    </div>
  );
};

const DynamicSearchCondition = dynamic(() => Promise.resolve(SearchCondition), { ssr: false });

export default DynamicSearchCondition;
