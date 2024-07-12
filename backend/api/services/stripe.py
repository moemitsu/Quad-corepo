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
            line_items=[
                {
                'price': 'price_1PapiD2KB7MtryeCx2PkDaEY',
                'quantity': 1,
                },
            ],
            mode='subscription',
            success_url=YOUR_DOMAIN + '?success=true',
            cancel_url=YOUR_DOMAIN + '?canceled=true',
        )
        return checkout_session.client_secret
    except Exception as e:
        raise e

def get_session_status(session_id):
    session = stripe.checkout.Session.retrieve(session_id)
    return {
        "status": session.status,
        "customer_email": session.customer_details.email
    }

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