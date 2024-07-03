import { useState, useEffect } from 'react';
import { auth } from '../firebase'; // Firebaseの初期化をインポート
import { signInWithEmailAndPassword, signOut, onAuthStateChanged, User } from 'firebase/auth';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      setUser(userCredential.user);
      if (userCredential.user) {
        const token = await userCredential.user.getIdToken(); // トークンを取得
        console.log('取得したトークン:', token); // トークンをコンソールに出力して確認
        return token; // トークンを返す
      } else {
        throw new Error('ユーザー認証に失敗しました');
      }
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      setUser(null);
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  };

  return {
    user,
    loading,
    login,
    logout,
  };
};
