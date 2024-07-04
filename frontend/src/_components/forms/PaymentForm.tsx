'use client';

import React, { useState } from 'react';
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
import { stripePromise } from '../../lib/stripe'; // Stripeの初期化ファイルをインポート
import axios from 'axios';

const PaymentForm: React.FC = () => {
  const stripe = useStripe();
  const elements = useElements();
  const [email, setEmail] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // バックエンドで支払いを作成するためのリクエスト
      const { data: clientSecret } = await axios.post('http://localhost:8000/', {
        email,
      });

      const cardElement = elements.getElement(CardElement);

      if (!cardElement) {
        setError('Card element not found');
        setLoading(false);
        return;
      }

      // カード情報を使用して支払いを確定する
      const { error: stripeError } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
          billing_details: {
            email,
          },
        },
      });

      if (stripeError) {
        setError(stripeError.message || 'Payment failed');
        setLoading(false);
        return;
      }

      alert('Payment successful!');
      setLoading(false);
    } catch (error) {
      setError('An error occurred while processing your payment. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-custom-green min-h-screen flex flex-col justify-center items-center">
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-4xl font-bold mb-6 text-center">Payment</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-lg font-semibold mb-2">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="card-element" className="block text-lg font-semibold mb-2">Card Details</label>
            <div id="card-element" className="w-full p-2 border border-gray-300 rounded">
              <CardElement />
            </div>
          </div>
          {error && <p className="text-red-500 text-center mb-4">{error}</p>}
          <button type="submit" className="w-full p-2 bg-custom-teal text-white rounded" disabled={!stripe || loading}>
            {loading ? 'Processing...' : 'Pay'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default PaymentForm;
