'use client'
import React from 'react';
import dynamic from 'next/dynamic';
import Header from "../../_components/layout/Header";
import Footer from "../../_components/layout/Footer";

const PaymentForm = dynamic(() => import('../../_components/forms/PaymentForm'), { ssr: false });
const PaymentPage: React.FC = () => {
  return (
    <div>
      <Header />
      <PaymentForm />
      <Footer />
    </div>
  );
};

export default PaymentPage;
