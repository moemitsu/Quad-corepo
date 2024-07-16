from fastapi import APIRouter, HTTPException, Request
from fastapi.responses import JSONResponse
import stripe
import os
from dotenv import load_dotenv

load_dotenv()  # 環境変数を読み込む

stripe.api_key = os.getenv('STRIPE_SECRET_KEY')
endpoint_secret = os.getenv('STRIPE_WEBHOOK_SECRET')
YOUR_DOMAIN = 'http://localhost:3000/'


def create_checkout_session(customer_id):
    try:
        checkout_session = stripe.checkout.Session.create(
            customer=customer_id,
            payment_method_types=["card"],
            #mode="payment",
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
        #return checkout_session.client_secret
        # return {"sessionId": checkout_session["id"]}
        return checkout_session["id"]
    except Exception as e:
        raise e

def get_session_status(session_id):
    session = stripe.checkout.Session.retrieve(session_id)
    return {
        "status": session.status,
        "customer_email": session.customer_details.email,
        "session_id":session_id
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
    
######################################################

def create_user(name,email):
    stripe.api_key = os.environ.get("STRIPE_SECRET_KEY")
    customer = stripe.Customer.create(
	    name=name, email=email
    )
    method_id = create_payment_method()
    stripe.Customer.modify(
        customer.id,
        invoice_settings={
            "default_payment_method": method_id,
        },
    )
    return customer.id

def create_payment_method():
    method = stripe.PaymentMethod.create(
        type="card",
        card={
        "number": "4242424242424242",
        "exp_month": 8,
        "exp_year": 2026,
        "cvc": "314",
        },
    )
    return method.id