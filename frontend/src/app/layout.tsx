'use client';

import { ReactNode } from 'react';
import { Elements } from '@stripe/react-stripe-js';
import { stripePromise } from '../lib/stripe';

interface LayoutProps {
  children: ReactNode;
}

const RootLayout = ({ children }: LayoutProps) => {
  return (
    <html lang="en">
      <body>
        <Elements stripe={stripePromise}>
          {children}
        </Elements>
      </body>
    </html>
  );
}

export default RootLayout;
