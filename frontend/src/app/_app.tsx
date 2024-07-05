import React from 'react';
import { AppProps } from 'next/app';
import { Elements } from '@stripe/react-stripe-js';
import { stripePromise } from '../lib/stripe';
import { StakeholderProvider } from '../../contexts/StakeholderContext';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Elements stripe={stripePromise}>
      <StakeholderProvider>
        <Component {...pageProps} />
      </StakeholderProvider>
    </Elements>
  );
}

export default MyApp;
