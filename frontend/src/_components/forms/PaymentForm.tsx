'use client'
import React, { useCallback } from "react";
import { loadStripe } from '@stripe/stripe-js';
import {
  EmbeddedCheckoutProvider,
  EmbeddedCheckout
} from '@stripe/react-stripe-js';
import { stripePromise } from '../../lib/stripe';

// Make sure to call `loadStripe` outside of a component’s render to avoid
// recreating the `Stripe` object on every render.

const CheckoutForm: React.FC = () => {
  const fetchClientSecret = useCallback(() => {
    // Create a Checkout Session
    return fetch("/create-checkout-session", {
      method: "POST",
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error('Network response was not ok');
        }
        return res.json();
      })
      .then((data) => data.clientSecret)
      .catch((error) => {
        console.error('Error fetching client secret:', error);
        throw error;
      });
  }, []);

  const options = { fetchClientSecret };

  return (
    <div id="checkout">
      <EmbeddedCheckoutProvider
        stripe={stripePromise}
        options={options}
      >
        <EmbeddedCheckout />
      </EmbeddedCheckoutProvider>
    </div>
  );
};

export default CheckoutForm;
