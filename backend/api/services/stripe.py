from fastapi import FastAPI, APIRouter, HTTPException, Depends, Request
from fastapi.responses import JSONResponse
import stripe
import os
from dotenv import load_dotenv

load_dotenv()  # 環境変数を読み込む

# Stripeのシークレットキーを設定
stripe.api_key = os.getenv('STRIPE_SECRET_KEY')
endpoint_secret = os.getenv('STRIPE_WEBHOOK_SECRET')

def create_checkout_session():
    try:
        # チェックアウトセッションを作成
        session = stripe.checkout.Session.create(
            payment_method_types=['card'],
            line_items=[{
                'price_data': {
                    'currency': 'usd',
                    'product_data': {
                        'name': 'T-shirt',
                    },
                    'unit_amount': 2000,  # 20.00 USD
                },
                'quantity': 1,
            }],
            mode='payment',
            success_url='https://your-frontend-url.com/success',
            cancel_url='https://your-frontend-url.com/cancel',
        )
        return session.id
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

def handle_stripe_webhook(payload, sig_header):
    try:
        event = stripe.Webhook.construct_event(
            payload, sig_header, endpoint_secret
        )
    except ValueError as e:
        # Invalid payload
        raise HTTPException(status_code=400, detail=str(e))
    except stripe.error.SignatureVerificationError as e:
        # Invalid signature
        raise HTTPException(status_code=400, detail=str(e))

    # Handle the event
    if event['type'] == 'checkout.session.completed':
        session = event['data']['object']
        handle_checkout_session(session)
    
    return {"message": "success"}

def handle_checkout_session(session):
    print("Payment was successful.")
    print(session)