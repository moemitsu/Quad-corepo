import logging
from sqlalchemy.orm import Session
import api.database.models as models, api.schemas.schemas as schemas

logger = logging.getLogger(f'custom.{__name__}')

# stakeholderテーブルのidを取得
def getStakeHolderId(db: Session, id: int):
  logger.info(f"Fetching getStakeHolderId")
  return db.query(models.Stakeholder).filter(models.Stakeholder.id == id).first()

# フロントエンドから来たトークンを保存する
def createStakeholder(db: Session, stakeholder:schemas.stakeholderReq):
  logger.info(f"Fetching createStakeholder")
  dbStakeholder = models.Stakeholder(
    stakeholder_name=stakeholder.stakeholder_name,
    firebase_id=stakeholder.firebase_id
  )
  db.add(dbStakeholder)
  db.commit()
  db.refresh(dbStakeholder)
  return dbStakeholder

# stakeholderテーブルのfirebase_idを取得
def getFirebaseId(db:Session, firebase_id: str):
  logger.info(f"Fetching getFirebaseId")
  return db.query(models.Stakeholder).filter(models.Stakeholder.firebase_id == firebase_id).first()