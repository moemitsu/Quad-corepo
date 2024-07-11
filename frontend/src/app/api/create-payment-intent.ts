'use client'
import { NextApiRequest, NextApiResponse } from 'next';
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { email } = req.body;

    try {
      // PaymentIntentを作成
      const paymentIntent = await stripe.paymentIntents.create({
        amount: 1000, // 支払い金額を適切に設定
        currency: 'usd',
        payment_method_types: ['card'],
        receipt_email: email,
      });

      res.status(200).json({ clientSecret: paymentIntent.client_secret });
    } catch (err: any) {
      res.status(err.statusCode || 500).json(err.message);
    }
  } else {
    res.setHeader('Allow', 'POST');
    res.status(405).end('Method Not Allowed');
  }
}
