// src/pages/share-link.tsx
'use client'
import React, { useState, useEffect } from 'react';
import { getAuth } from 'firebase/auth';
import { collection, addDoc } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import Header from '../../_components/layout/Header';
import Footer from '../../_components/layout/Footer';
import { db, auth } from '@/lib/firebase'; // Firebaseの関数をインポート

const ShareLinkPage: React.FC = () => {
  const [linkId, setLinkId] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (!router) return; // routerがnullの場合に早期リターン
    // ここでrouterを使用しても安全
  }, [router]);

  const generateShareLink = async () => {
    const user = auth.currentUser;

    if (user) {
      try {
        // Firestoreに共有リンクを保存
        const docRef = await addDoc(collection(db, 'share_links'), {
          createdBy: user.uid,
          createdAt: new Date(),
        });
        setLinkId(docRef.id); // ドキュメントIDをstateにセット
      } catch (error) {
        console.error('Error adding document: ', error);
      }
    } else {
      console.error('User not authenticated.');
    }
  };

  const handleShareLinkClick = () => {
    if (linkId) {
      router.push(`/share/${linkId}`); // 生成したリンクに遷移
    }
  };

  return (
    <div>
      <Header />
      <div className="p-36 min-h-screen flex flex-col">
        <h1 className="text-2xl font-bold mb-4">共有リンク生成</h1>
        <button
          onClick={generateShareLink}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          共有リンクを生成する
        </button>
        {linkId && (
          <div className="mt-4">
            <p>生成された共有リンク: <strong>{`http://localhost:3000/share/${linkId}`}</strong></p>
            <button
              onClick={handleShareLinkClick}
              className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mt-2"
            >
              生成したリンクを開く
            </button>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default ShareLinkPage;
