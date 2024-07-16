from fastapi import APIRouter, HTTPException, Request
from fastapi.responses import JSONResponse
from api.services.stripe import create_checkout_session, handle_stripe_webhook, get_session_status, create_user
import stripe
import os
from dotenv import load_dotenv

load_dotenv()  # 環境変数を読み込む
router = APIRouter()


@router.post("/create-checkout-session")
async def create_checkout_session_endpoint():
    try:
        client_secret = create_checkout_session()
        return JSONResponse(content={"clientSecret": client_secret})
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get('/session-status?session_id=cs_test_a1GmU6HYm8Hh28iOCYbBwX6zLKotaFqS6JXcdHmoytyifsTyelVzyyi7eC')
async def session_status(request: Request):
    session_id = request.query_params.get('session_id')
    if not session_id:
        raise HTTPException(status_code=400, detail="session_id is required")
    try:
        status_data = get_session_status(session_id)
        return JSONResponse(content=status_data)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/webhook")
async def stripe_webhook(request: Request):
    payload = await request.body()
    sig_header = request.headers.get('stripe-signature')
    response = handle_stripe_webhook(payload, sig_header)
    return JSONResponse(status_code=200, content=response)



@router.get("/config")
def get_publishable_key():
    price = stripe.Price.retrieve() 
    return {
        "publicKey": os.getenv("STRIPE_PUBLISHABLE_KEY"),
        "unitAmount": price["unit_amount"],
        "currency": price["currency"],
    }

##################################################


@router.post("/create-user-session")
async def create_user_session():
    try:
        client_secret = create_user("hogehoge","wayawaya@gmail.com")
        return JSONResponse(content={"clientSecret": client_secret})
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.post("/checkout-session2")
async def create_checkout_session_endpoint():
    try: # "cus_QTNPxxP6nODKbz" #
        client_id = 'cus_QTNlsRdhFzPdNB' #create_user("aaahogehoge","ssswayawaya@gmail.com")
        session_id = create_checkout_session(client_id)
        if not session_id:
            raise HTTPException(status_code=400, detail="session_id is required")
        try:
            status_data = get_session_status(session_id)
            return JSONResponse(content=status_data)
        except Exception as e:
            raise HTTPException(status_code=402, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=401, detail=str(e))

@router.get("/config2")
def get_publishable_key():
    status_data = get_session_status("cs_test_a1qF1KF8ytJuQMbwxYNeKO9frxvCqXpvystsaldH9ppzC6PwvKEX4hix1S")
    return JSONResponse(content=status_data)

