from sqlalchemy.orm import Session
import backend.api.database.Models as models, backend.api.schemas.schemas as schemas

# Paymentsテーブルのid取得
def getPaymentsId(db: Session, id: int):
  return db.query(models.Payments).filter(models.Payments.id == id)