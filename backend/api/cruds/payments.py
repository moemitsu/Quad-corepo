import logging
from sqlalchemy.orm import Session
import api.database.models as models, api.schemas.schemas as schemas

logger = logging.getLogger(f'custom.{__name__}')

# Paymentsテーブルのid取得
def getPaymentsId(db: Session, id: int):
  logger.info(f"Fetching getPaymentsId")
  return db.query(models.Payments).filter(models.Payments.id == id)