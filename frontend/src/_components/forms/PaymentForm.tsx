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
        <div dangerouslySetInnerHTML={{__html: `
          <stripe-buy-button
            buy-button-id="buy_btn_1PaprZ2KB7MtryeCrlpCXjHw"
            publishable-key="pk_test_51PZ1U92KB7MtryeC0GeQiocQwDstKH0qQdktlzLQWy107zqfdADAPoP7exKtQnBurFspFDRdIHAj08Vx86z0D0RL00zWPiol3J"
          >
          </stripe-buy-button>
        `}} />
      </div>
    </div>
  );
};

export default PaymentRedirect;