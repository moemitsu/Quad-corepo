import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_MY_STRIPE_PUBLIC_KEY!);

export { stripePromise };