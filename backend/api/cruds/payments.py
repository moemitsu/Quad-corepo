from sqlalchemy.orm import Session
import api.database.Models as models, api.schemas.schemas as schemas

# Paymentsテーブルのid取得
def getPaymentsId(db: Session, id: int):
  return db.query(models.Payments).filter(models.Payments.id == id)