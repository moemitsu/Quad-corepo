'use client'
import React, { useEffect, useState } from 'react';
import axios from 'axios'; 
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../../lib/firebase';
import { useRouter } from 'next/navigation'; 

interface CheckEmptyProps {
  isEmpty: boolean;
}

const CheckEmpty: React.FC<CheckEmptyProps> = ({ isEmpty }) => {
  const [data, setData] = useState<any[]>([]);
  const [user, loading, error] = useAuthState(auth); // Firebase auth instance
  const [token, setToken] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!loading && user) {
          const idToken = await user.getIdToken();
          setToken(idToken);
          const response = await axios.get('http://localhost:8000/api/v1/family-records/all', {
            params: {
              year: 2024, // Example year and month
              month: 7,
            },
            headers: {
              Authorization: `Bearer ${idToken}`,
            },
          });
          console.log('空でない場合のdata',response.data)
          setData(response.data);
        }
      } catch (error) {
        console.error('データの取得に失敗しました', error);
      }
    };

    fetchData(); // Fetch data function
  }, [user, loading]);

  return (
    <div>
      {loading ? (
        <p className="text-gray-500 text-lg">データを読み込んでいます...</p>
      ) : (
        <div className="flex items-center justify-center h-2">
          {isEmpty ? (
            <p className="text-red-500 text-lg">
              データがまだありません。記録を追加するボタンから2つ以上記録を追加してください。
            </p>
          ) : (
            <p className="text-gray-500 text-lg">データが読み込まれています...</p>
          )}
        </div>
      )}
    </div>
  );
};

export default CheckEmpty;
