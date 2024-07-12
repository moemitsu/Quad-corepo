'use client'
import React from 'react';
import PaymentForm from '../../_components/forms/PaymentForm';
import Header from "../../_components/layout/Header";
import Footer from "../../_components/layout/Footer";

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