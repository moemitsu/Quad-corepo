import { AppProps } from 'next/app';
import { Elements } from '@stripe/react-stripe-js';
import { stripePromise } from '../lib/stripe';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Elements stripe={stripePromise}>
      <Component {...pageProps} />
    </Elements>
  );
}

export default MyApp;
