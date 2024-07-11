'use client'
import React from 'react';
import PaymentForm from '../../_components/forms/PaymentForm';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Return from '../../_components/forms/Return';
import Header from "../../_components/layout/Header";
import Footer from "../../_components/layout/Footer";

const PaymentPage: React.FC = () => {
  return (
    <div>
      <Header />
      <div className="App">
      <Router>
        <Routes>
          <Route path="/checkout" element={<PaymentForm />} />
          <Route path="/return" element={<Return />} />
        </Routes>
      </Router>
    </div>
      <Footer />
    </div>
  );
};

export default PaymentPage;
