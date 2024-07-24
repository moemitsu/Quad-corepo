'use client';

import React from 'react';
import LoginForm from '../../_components/forms/LoginForm';
import Header from '../../_components/layout/Header';
import Footer from '../../_components/layout/Footer';

const LoginPage: React.FC = () => {
  return (
    <div>
      <Header />
      <div className="bg-custom-light-green min-h-screen flex flex-col justify-center items-center">
        <div className="w-full max-w-xl"> 
          <LoginForm />
        </div> 
      </div>
      <Footer />
    </div>
  );
};

export default LoginPage;
