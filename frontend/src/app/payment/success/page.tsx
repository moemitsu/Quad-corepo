'use client';
import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../../hooks/useAuth';
import Header from "../../../_components/layout/Header";
import Footer from "../../../_components/layout/Footer";
import axios from 'axios';

const SuccessPage = () => {
  const { user } = useAuth();
  const router = useRouter();
  useEffect(() => {
    const postPayment = async () => {
      if (user){
        try {
          // IDトークンを取得
          const token = await user.getIdToken();
          await axios.post('http://localhost:8000/stripe/api/v1/payments', null, {
              headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          setTimeout(() => {
            router.push('../monthly-analysis');
          }, 5000);
        } catch (error) {
          console.error('Payment post error:', error);
        }
      }
    };
    postPayment();
  }, [user, router]);

  return (
    <div>
      <Header />
        <div className="container">
          <h1>ありがとうございます！お支払い完了しました！</h1>
          <p>5秒後に月次分析ページに遷移します。</p>
          <button onClick={() => router.push('/monthly-analysis')}>今すぐ遷移する</button>
        </div>
      <Footer />
    </div>
  );
};

export default SuccessPage;
