'use client'
import React, {  useState, useEffect } from "react";
import {
  EmbeddedCheckoutProvider,
  EmbeddedCheckout
} from '@stripe/react-stripe-js';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import {stripePromise} from '../../lib/stripe';
// Make sure to call `loadStripe` outside of a component’s render to avoid
// recreating the `Stripe` object on every render.
// This is your test secret API key.

const CheckoutForm = () => {
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  useEffect(() => {
    // Create a Checkout Session
    axios.post('http://localhost:8000/stripe/create-checkout-session')
      .then((res) => setClientSecret(res.data.clientSecret))
      .catch((error) => console.error('Error creating checkout session:', error));
  }, []);

  const options = { clientSecret };

  return (
    <div id="checkout">
      {clientSecret && (
        <EmbeddedCheckoutProvider
          stripe={stripePromise}
          options={options}
        >
        <EmbeddedCheckout />
        </EmbeddedCheckoutProvider>
      )}
    </div>
  );
}

const Return = () => {
  const router = useRouter();
  const [status, setStatus] = useState<string | null>(null);
  const [customerEmail, setCustomerEmail] = useState<string>('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const queryString = window.location.search;
      const urlParams = new URLSearchParams(queryString);
      const sessionId = urlParams.get('session_id');

      if (sessionId){
        axios.get(`http://localhost:8000/stripe/session-status`, {params:{ session_id:sessionId } })
          .then((res) => {
            setStatus(res.data.status);
            setCustomerEmail(res.data.customer_email);
          })
          .catch((error) => console.error('Error fetching session status:', error));
      }
    }
  }, []);

  useEffect(() => {
    if (status === 'open') {
      router.push('/payment/checkout');
    }
  },[status, router]);

  if (status === 'complete') {
    return (
      <section id="success">
        <p>
          We appreciate your business! A confirmation email will be sent to {customerEmail}.

          If you have any questions, please email <a href="mailto:orders@example.com">orders@example.com</a>.
        </p>
      </section>
    )
  }

  return (
    <div>
      <p>Checking payment status...</p>
    </div>
  );
};

const App = () => {
  if (typeof window === 'undefined') {
    return null;
  }
  return (
    <div className="App">
      <CheckoutForm />
      <Return />
    </div>
  )
}

export default App;