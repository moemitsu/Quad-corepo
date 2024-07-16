import React, { useCallback, useState, useEffect } from "react";
import {
  EmbeddedCheckoutProvider,
  EmbeddedCheckout
} from '@stripe/react-stripe-js';
import { useRouter } from 'next/navigation';
import {stripePromise} from '../../lib/stripe';
// Make sure to call `loadStripe` outside of a component’s render to avoid
// recreating the `Stripe` object on every render.
// This is your test secret API key.

const PaymentRedirect: React.FC = () => {
  const TestKey = process.env.NEXT_PUBLIC_MY_STRIPE_PUBLIC_KEY
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://js.stripe.com/v3/buy-button.js';
    script.async = true;
    document.body.appendChild(script);
    
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <div className="p-6 min-h-screen flex flex-col justify-center items-center">
      <div className="p-6 rounded-lg shadow-md w-full max-w-sm">
        <h2 className="text-4xl font-bold mb-6 text-center">支払いを行う</h2>
        <div dangerouslySetInnerHTML={{__html: `
          <stripe-buy-button
            buy-button-id="buy_btn_1PaprZ2KB7MtryeCrlpCXjHw"
            publishable-key=${TestKey}
          >
          </stripe-buy-button>
        `}} />
      </div>
    </div>
  );
};

export default PaymentRedirect;
