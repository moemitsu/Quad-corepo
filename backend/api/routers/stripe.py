from fastapi import APIRouter, HTTPException, Request
from fastapi.responses import JSONResponse
from api.services.stripe import create_checkout_session, handle_stripe_webhook, get_session_status
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

@router.get('/session-status')
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