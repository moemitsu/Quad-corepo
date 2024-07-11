'use client'
import React, { useCallback, useState, useEffect } from "react";
import {loadStripe} from '@stripe/stripe-js';
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
  const fetchClientSecret = useCallback(() => {
    // Create a Checkout Session
    return axios.post('http://localhost:8000/create-checkout-session')
      .then((res) => res.data.clientSecret);
  }, []);

  const options = {fetchClientSecret};

  return (
    <div id="checkout">
      <EmbeddedCheckoutProvider
        stripe={stripePromise}
        options={options}
      >
        <EmbeddedCheckout />
      </EmbeddedCheckoutProvider>
    </div>
  )
}

const Return = () => {
  const router = useRouter();
  const [status, setStatus] = useState(null);
  const [customerEmail, setCustomerEmail] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined' && typeof document !== 'undefined'){
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const sessionId = urlParams.get('session_id');

      axios.get(`http://localhost:8000/session-status`, {params:{ session_id:sessionId}})
        .then((res) => {
          setStatus(res.data.status);
          setCustomerEmail(res.data.customer_email);
        })
        .catch((error) => {
          console.error('Error fetching session status:', error);
        }
      );
    }
  }, []);

  useEffect(() => {
    if (status === 'open') {
      router.push('/checkout');
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

  return null;
}

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