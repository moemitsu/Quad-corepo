from sqlalchemy.orm import Session
import models, backend.api.schemas.schemas as schemas

# Userテーブルのidを取得
def getUserId(db: Session, id: int):
  return db.query(models.User).filter(models.User.id == id).first()