from fastapi import APIRouter, HTTPException, Request
from fastapi.responses import JSONResponse
import stripe
import os
from dotenv import load_dotenv

load_dotenv()  # 環境変数を読み込む

stripe.api_key = os.getenv('STRIPE_SECRET_KEY')
endpoint_secret = os.getenv('STRIPE_WEBHOOK_SECRET')
YOUR_DOMAIN = 'http://localhost:3000/'


def create_checkout_session():
    try:
        checkout_session = stripe.checkout.Session.create(
            line_items=[{
                "price_data": {
                    "currency": "jpy",
                    "product_data": {
                        "name": "LLM分析",
                    },
                    "unit_amount": 80000,
                    "recurring": {  # 追加: 定期購入の詳細
                        "interval": "month"
                    }
                },
                "quantity": 1,
            }],
            mode='subscription',
            success_url=YOUR_DOMAIN + '?success=true',
            cancel_url=YOUR_DOMAIN + '?canceled=true',
        )
        return checkout_session.id
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

def handle_stripe_webhook(payload, sig_header):
    try:
        event = stripe.Webhook.construct_event(payload, sig_header, endpoint_secret)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except stripe.error.SignatureVerificationError as e:
        raise HTTPException(status_code=400, detail=str(e))

    if event['type'] == 'checkout.session.completed':
        session = event['data']['object']
        handle_checkout_session(session)
    
    return {"message": "success"}


def handle_checkout_session(session):
    print("Payment was successful.")
    print(session)
