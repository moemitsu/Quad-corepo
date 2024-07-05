// src/app/login/page.tsx

'use client';

import React from 'react';
import LoginForm from '../../_components/forms/LoginForm';
import Header from "../../_components/layout/header";
import Footer from "../../_components/layout/footer";

const LoginPage: React.FC = () => {
  return (
    <div>
      <Header />
      <LoginForm />
      <Footer />
    </div>
  );
};

export default LoginPage;
