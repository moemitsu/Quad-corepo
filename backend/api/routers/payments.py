from logging import config, getLogger
from fastapi import FastAPI, HTTPException, Depends, Query, Body, APIRouter
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session
import os
from dotenv import load_dotenv
from typing import Optional, List, Dict, Any
from api.database.db import SessionLocal, engine
import api.database.models as models
from api.database.models import User
import api.schemas.payments as schemas
import api.cruds.payments as paymentsCrud
import api.cruds.stakeholder as stakeholderCrud
from api.lib.auth import verify_token

models.Base.metadata.create_all(bind=engine)
load_dotenv()

# Initialize the logger
logger = getLogger(__name__)

app = FastAPI()
router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post('/api/v1/payments', response_model=schemas.PaymentsRes, responses={400: {'model': schemas.Error}})
def success_payment(
        request: schemas.PaymentsReq,
        token: str = Depends(verify_token),
        db: Session = Depends(get_db)
    ):
        logger.info('------------------Payment', request)
        firebase_id = token['uid']
        stakeholder = stakeholderCrud.get_firebase_id(db, firebase_id)
        if not stakeholder:
            logger.error("Stakeholder not found")
            raise HTTPException(status_code=400, detail='ユーザーが見つかりません')
        try:
            # 指定された条件を満たすユーザーを取得
            user = db.query(User).filter(
                User.stakeholder_id == stakeholder.id,
                User.adult_name.isnot(None)
            ).first()
            if not user:
                logger.error("No user found matching the criteria")
                raise HTTPException(status_code=400, detail='条件を満たすユーザーが見つかりません')
        
            record = paymentsCrud.success_payment(
                db=db,
                stakeholder_id=stakeholder.id,
                user_id=user.id,
            )
            return schemas.RecordRes(message='記録を追加しました', record_id=record.id)
        
        except Exception as e:
            logger.error(f"Error creating record: {e}")
            return JSONResponse(status_code=400, content={"detail": "記録の作成中にエラーが発生しました"})
