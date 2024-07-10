'use client';

import React, { useState, useEffect } from 'react';
import Image from "next/image";
import axios from 'axios';

const PaymentRedirect: React.FC = () => {
  const [message, setMessage] = useState("");

  useEffect(() => {
    // Check to see if this is a redirect back from Checkout
    const query = new URLSearchParams(window.location.search);

    if (query.get("success")) {
      setMessage("Order placed! You will receive an email confirmation.");
    }

    if (query.get("canceled")) {
      setMessage("Order canceled -- continue to shop around and checkout when you're ready.");
    }
  }, []);

  const handlePayment = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      const response = await axios.post('http://localhost:8000/create-checkout-session', {
        price_id: 'price_1PaTu62KB7MtryeCVN2wPmNq',  // ここに実際のPrice IDを入力
        quantity: 1,
      });
      window.location.href = response.data.url;
    } catch (error) {
      console.error('Error creating checkout session:', error);
    }
  };

  return (
    <div className="p-6 min-h-screen flex flex-col justify-center items-center">
      <div className="p-6 rounded-lg shadow-md w-full max-w-sm">
        <h2 className="text-4xl font-bold mb-6 text-center">支払いを行う</h2>
        {message ? (
          <section>
            <p>{message}</p>
          </section>
        ) : (
          <section>
            <div className="product">
              <h3 className="text-2xl font-bold">LLM分析機能</h3>
              <h5 className="text-xl font-semibold">￥500 / 1 カ月</h5>
              <p className="text-sm text-gray-600">登録する</p>
              <p className="text-sm text-gray-600">TEST MODE</p>
              <p className="text-sm text-gray-600">サポートされている決済手段:</p>
              <Image src="https://i.imgur.com/EHyR2nP.png" alt="Payment Methods" className="mt-2 mb-4" />
            </div>
            <form onSubmit={handlePayment}>
              <button type="submit" className="w-full p-2 bg-custom-teal text-white rounded mb-4">
                Checkout
              </button>
            </form>
          </section>
        )}
      </div>
    </div>
  );
};

export default PaymentRedirect;