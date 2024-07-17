// src/app/share/[id]/page.tsx
'use client'
import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation"; // 正しいインポートを追加
import Header from "@/_components/layout/Header";
import Footer from "@/_components/layout/Footer";
import axios from "axios";
import { getAuth } from "firebase/auth";
import MonthlyAnalysis from "@/app/monthly-analysis/page";

const SharePage: React.FC = () => {
  const [isValid, setIsValid] = useState<boolean>(false);
  const searchParams = new URLSearchParams(useSearchParams()); // useSearchParams()を正しく使う
  const id = searchParams.get("id"); // クエリパラメータからidを取得する
  const auth = getAuth();
  console.log('id',id)

  useEffect(() => {
    const validateLink = async () => {
      if (id) { // ユーザーがログインしていることを確認
        try {
          const response = await axios.get(`http://localhost:3000/api/share-link?id=${id}`);
          console.log(response.data);
          setIsValid(response.data.isValid);
        } catch (error) {
          setIsValid(false);
        }
      } else {
        setIsValid(false); // ユーザーがログインしていない場合は無効なリンクとみなす
      }
    };
    validateLink();
  }, [id]); // idが変更されたときに再度呼び出す

  if (!isValid) {
    return <p>リンクが無効または期限切れです。</p>;
  }

  return (
    <div>
      <Header />
      <div className="p-6 min-h-screen flex flex-col">
        <MonthlyAnalysis />
      </div>
      <Footer />
    </div>
  );
};

export default SharePage;
