from logging import config, getLogger
from fastapi import APIRouter, HTTPException, Request
from fastapi.responses import JSONResponse
from uuid import UUID
from sqlalchemy.orm import Session
from api.database.models import Payments
import stripe
import os
from dotenv import load_dotenv

load_dotenv()  # 環境変数を読み込む
# Initialize the logger
logger = getLogger(__name__)

stripe.api_key = os.getenv('STRIPE_SECRET_KEY')
endpoint_secret = os.getenv('STRIPE_WEBHOOK_SECRET')
print(os.getenv('STRIPE_SECRET_KEY'))

def create_checkout_session():
    try:
        logger.info('------------------ create-checkout-session2')
        checkout_session = stripe.checkout.Session.create(
            line_items=[
                {
                'price': 'price_1PapiD2KB7MtryeCx2PkDaEY',
                'quantity': 1,
                },
            ],
            mode='subscription',
            success_url='http://localhost:3000/payment/success',
            cancel_url='http://localhost:3000/payment/cancel',
        )
        return checkout_session.client_secret
    except Exception as e:
        raise e

def get_session_status(session_id):
    session = stripe.checkout.Session.retrieve(session_id)
    logger.info('------------------ create-checkout-session4')
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
    
    return {"message": "success"}


