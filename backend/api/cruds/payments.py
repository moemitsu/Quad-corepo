from logging import config, getLogger
from sqlalchemy.orm import Session
import api.database.models as models, api.schemas.schemas as schemas
from uuid import UUID
import stripe
import os
from dotenv import load_dotenv

load_dotenv()  # 環境変数を読み込む
logger = getLogger(__name__)

def success_payment(db: Session, stakeholder_id: UUID, user_id: int):
    print("Payment was successful.")
    try:
        new_record = models.Payments(
            stakeholder_id = stakeholder_id,
            user_id = user_id
        )
        db.add(new_record)
        db.commit()
        db.refresh(new_record)
        return new_record
    except Exception as e:
        logger.error(f"Error creating record: {e}")
        raise
