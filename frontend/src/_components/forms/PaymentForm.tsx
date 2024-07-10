'use client';

import React, { useEffect } from 'react';

const PaymentRedirect: React.FC = () => {
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
            publishable-key="pk_test_51PZ1U92KB7MtryeC0GeQiocQwDstKH0qQdktlzLQWy107zqfdADAPoP7exKtQnBurFspFDRdIHAj08Vx86z0D0RL00zWPiol3J"
          >
          </stripe-buy-button>
        `}} />
      </div>
    </div>
  );
};

export default PaymentRedirect;
