// src/app/share/[id]/page.tsx
'use client'
import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Header from "@/_components/layout/Header";
import Footer from "@/_components/layout/Footer";
import axios from "axios";
import Practice from "@/app/practice/page";
import { getAuth } from "firebase/auth";

const SharePage: React.FC = () => {
  const [isValid, setIsValid] = useState<boolean>(false);
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const auth = getAuth();

  useEffect(() => {
    const validateLink = async () => {
      if (id && auth.currentUser) { // ユーザーがログインしていることを確認
        try {
          const response = await axios.get(`/api/share-link?id=${id}`);
          setIsValid(response.data.isValid);
        } catch (error) {
          setIsValid(false);
        }
      } else {
        setIsValid(false); // ユーザーがログインしていない場合は無効なリンクとみなす
      }
    };

    validateLink();
  }, [id, auth.currentUser]);

  if (!isValid) {
    return <p>リンクが無効または期限切れです。</p>;
  }

  return (
    <div>
      <Header />
      <div className="p-6 min-h-screen flex flex-col">
        <Practice />
      </div>
      <Footer />
    </div>
  );
};

export default SharePage;
