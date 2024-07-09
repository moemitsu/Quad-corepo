import { useState, useEffect } from 'react';
import { auth } from '../lib/firebase'; // Firebaseの初期化ファイルをインポート
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
      const idToken = await userCredential.user.getIdToken();
      return { userCredential, idToken };
    } catch (error: any) {
      console.error('Login error:', error);
      throw error; // エラーをスローして上位コンポーネントで処理
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      setUser(null);
    } catch (error) {
      console.error('Logout error:', error);
      throw error; // エラーをスローして上位コンポーネントで処理
    }
  };

  return {
    user,
    loading,
    login,
    logout,
  };
};
