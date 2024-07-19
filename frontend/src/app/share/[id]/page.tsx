"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Header from "../../../_components/layout/Header";
import Footer from "../../../_components/layout/Footer";
import axios from "axios";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import MonthlyAnalysis from "@/app/monthly-analysis/page";

const SharePage = ({ params }: { params: { id: string } }) => {
  const [isValid, setIsValid] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [authToken, setAuthToken] = useState<string>("");
  const router = useRouter();
  const id = params.id;

  useEffect(() => {
    const validateLink = async () => {
      try {
        const response = await axios.get(`/api/share-link?id=${id}`);
        console.log(response.data);
        setIsValid(response.data.isValid);
      } catch (error) {
        console.error("Error validating link:", error);
        setIsValid(false);
      }
      setIsLoading(false);
    };

    const checkAuthState = () => {
      const auth = getAuth();
      onAuthStateChanged(auth, (user) => {
        if (user) {
          user.getIdToken(/* forceRefresh */ true).then((token) => {
            setAuthToken(token);
            validateLink();
          });
        } else {
          // 認証されていない場合、ログインページにリダイレクト
          router.push("/login");
        }
      });
    };

    checkAuthState();
  }, [id, router]);

  if (isLoading) {
    return <p>読み込み中...</p>;
  }

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
