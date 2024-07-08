from sqlalchemy.orm import Session
import api.database.models as models, api.schemas.schemas as schemas


# stakeholderテーブルのidを取得
def getStakeHolderId(db: Session, id: int):
  return db.query(models.Stakeholder).filter(models.Stakeholder.id == id).first()

# フロントエンドから来たトークンを保存する
def createStakeholder(db: Session, stakeholder:schemas.StakeHolderReq):
  dbStakeholder = models.Stakeholder(
    stakeholder_name=stakeholder.stakeholder_name,
    firebase_id=stakeholder.firebase_id
  )
  db.add(dbStakeholder)
  db.commit()
  db.refresh(dbStakeholder)
  return dbStakeholder

# Stakeholderのfirebase_idを更新
def updateFirebaseId(db: Session, id: int, firebase_id: str):
  dbStakeholder = db.query(models.Stakeholder).filter(models.Stakeholder.id == id).first()
  if dbStakeholder:
    dbStakeholder.firebase_id = firebase_id
    db.commit()
    db.refresh(dbStakeholder)
    return dbStakeholder
  else:
    return None
  
# stakeholderテーブルのfirebase_idを取得
def getFirebaseId(db:Session, firebase_id: str):
  return db.query(models.Stakeholder).filter(models.Stakeholder.firebase_id == firebase_id).first()
