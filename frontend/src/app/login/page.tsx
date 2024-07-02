// src/app/login/page.tsx

'use client';

import React from 'react';
import LoginForm from '../../_components/LoginForm';

const LoginPage: React.FC = () => {
  return (
    <div>
      <h1>ログインページ</h1>
      <LoginForm />
    </div>
  );
};

export default LoginPage;
