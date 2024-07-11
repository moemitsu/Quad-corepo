'use client';
import React, { useEffect } from 'react';
import { useRouter } from 'next/router';

const CancelPage = () => {
    const router = useRouter();

    useEffect(() => {
        // 5秒（5,000ミリ秒）後に遷移
        const timer = setTimeout(() => {
            router.push('/monthly-analysis'); // 遷移先のページを指定
        }, 5000); // 5,000ミリ秒 = 5秒

        return () => clearTimeout(timer); // クリーンアップタイマー
    }, [router]);

    return (
        <div>
            <h1>お支払いがキャンセルされました。</h1>
            <p>5秒後にmonthly-analysisページにリダイレクトされます。</p>
        </div>
    );
};

export default CancelPage;
