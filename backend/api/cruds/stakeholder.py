from sqlalchemy.orm import Session
import backend.api.database.models as models, backend.api.schemas.schemas as schemas

# stakeholderテーブルのidを取得
def getStakeHolderId(db: Session, id: int):
  return db.query(models.Stakeholder).filter(models.Stakeholder.id == id).first()

# stakeholderテーブルのfirebase_idを取得
def getFirebaseId(db:Session, firebase_id: str):
  return db.query(models.Stakeholder).filter(models.Stakeholder.firebase_id == firebase_id).first()