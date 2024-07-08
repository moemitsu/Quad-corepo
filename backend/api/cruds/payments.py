import logging
from sqlalchemy.orm import Session
import api.database.models as models, api.schemas.schemas as schemas

# Paymentsテーブルのid取得
def get_payments_id(db: Session, id: int):
  return db.query(models.Payments).filter(models.Payments.id == id)