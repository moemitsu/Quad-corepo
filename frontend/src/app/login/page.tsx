'use client';

import React from 'react';
import LoginForm from '../../_components/forms/LoginForm';
import Header from '../../_components/layout/header';
import Footer from '../../_components/layout/Footer';

const LoginPage: React.FC = () => {
  return (
    <div>
      <Header />
      <div className="p-6 min-h-screen flex flex-col justify-center items-center">
        <LoginForm />
      </div>
      <Footer />
    </div>
  );
};

export default LoginPage;
