import logging
from sqlalchemy.orm import Session
import api.database.models as models, api.schemas.schemas as schemas
from uuid import uuid4

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

# stakeholderテーブルのfirebase_idを取得
def getFirebaseId(db:Session, firebase_id: str):
  return db.query(models.Stakeholder).filter(models.Stakeholder.firebase_id == firebase_id).first()

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

# 新規登録（新しいstakeholder_idを取得）
def create_new_stakeholder(db: Session, firebase_id: str):
  stakeholder_id = uuid4()
  dbStakeholder = models.Stakeholder(
    id=stakeholder_id,
    stakeholder_name="",
    firebase_id=firebase_id
  )
  db.add(dbStakeholder)
  db.commit()
  db.refresh(dbStakeholder)
  return dbStakeholder

def update_stakeholder_name(db: Session, stakeholder_id: uuid4, stakeholder_name: str):
  db_stakeholder = db.query(models.Stakeholder).filter(models.Stakeholder.id == stakeholder_id).first()
  if db_stakeholder:
    db_stakeholder.stakeholder_name = stakeholder_name
    db.commit()
    db.refresh(db_stakeholder)
    return db_stakeholder
  else:
    return None