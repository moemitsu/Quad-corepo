import { useState, useEffect } from 'react';
import { auth } from '../lib/firebase'; // Firebaseの初期化をインポート
import { signInWithEmailAndPassword, signOut, onAuthStateChanged, User } from 'firebase/auth';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUser(user);
        const token = await user.getIdToken();
        setToken(token);
      } else {
        setUser(null);
        setToken(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      setUser(userCredential.user);
      const token = await userCredential.user.getIdToken(); // トークンを取得
      setToken(token);
      return token; // トークンを返す
    } catch (error: any) {
      console.error('Login error:', error);
      throw error; // エラーを投げて上位コンポーネントで処理
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      setToken(null);
    } catch (error) {
      console.error('Logout error:', error);
      throw error; // エラーを投げて上位コンポーネントで処理
    }
  };

  return {
    user,
    loading,
    token,
    login,
    logout,
  };
};
