from sqlalchemy.orm import Session
import backend.api.database.models as models, backend.api.schemas.schemas as schemas

# stakeholderテーブルのidを取得
def getStakeHolderId(db: Session, id: int):
  return db.query(models.stakeholder).filter(models.stakeholder.id == id).first()