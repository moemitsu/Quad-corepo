from logging import config, getLogger
from fastapi import APIRouter, HTTPException, Request, Depends
from fastapi.responses import JSONResponse
from api.services.stripe import create_checkout_session, handle_stripe_webhook, get_session_status
from api.cruds.payments import success_payment
import api.schemas.stripe as schemas
import api.cruds.stakeholder as stakeholderCrud
from api.database.db import SessionLocal
from sqlalchemy.orm import Session
from api.lib.auth import verify_token
import stripe
import os
from dotenv import load_dotenv

load_dotenv()  # 環境変数を読み込む
router = APIRouter()
# Initialize the logger
logger = getLogger(__name__)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/create-checkout-session")
async def create_checkout_session_endpoint():
    logger.info('------------------ create-checkout-session1')
    try:
        client_secret = create_checkout_session()
        return JSONResponse(content={"clientSecret": client_secret})
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get('/session-status')
async def session_status(request: Request):
    session_id = request.query_params.get('session_id')
    logger.info('------------------ create-checkout-session3'+session_id)
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

@router.post('/api/v1/payments', response_model=schemas.StripeRes, responses={400: {'model': schemas.Error}})
def success_payment(
        request: schemas.StripeReq,
        token: str = Depends(verify_token),
        db: Session = Depends(get_db)
    ):
        logger.info('------------------post payment1')
        firebase_id = token['uid']
        stakeholder = stakeholderCrud.get_firebase_id(db, firebase_id)
        if not stakeholder:
            logger.error("Stakeholder not found")
            raise HTTPException(status_code=400, detail='ユーザーが見つかりません')
        try:
            print('------------------create record2')
            record = success_payment(
                db=db,
                stakeholder_id=stakeholder.id,
                user_id=request.user_id
        )
            return schemas.StripeRes(message='記録を追加しました', payment_id=record.id)
        except Exception as e:
            logger.error(f"Error creating record: {e}")
        return JSONResponse(status_code=400, content={"detail": "お支払いの記録作成でエラーが起こりました"})
