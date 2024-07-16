import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from './useAuth';

interface UseUserInfoReturn {
  userInfo: UserInfo | null;
  loading: boolean;
}

interface UserInfo
{
  stakeholder_id: string; // UUID型をstring型として定義
  stakeholder_name: string;
  message: string;
}

export const useUserInfo = (): UseUserInfoReturn => {
  const { user } = useAuth();
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserInfo = async () => {
      if (!user) return;
      try {
        const token = await user.getIdToken();
        const response = await axios.get<UserInfo>('http://localhost:8000/api/v1/user-info', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUserInfo(response.data);
      } catch (error) {
        console.error('Error fetching user info:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserInfo();
  }, [user]);

  return { userInfo, loading };
};
