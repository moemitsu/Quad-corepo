from logging import config, getLogger
from sqlalchemy.orm import Session
import api.database.models as models, api.schemas.schemas as schemas
from uuid import uuid4

logger = getLogger(__name__)

# stakeholderテーブルのidを取得

def get_stakeholder_id(db: Session, id: int):
  logger.info('stakeholder_id get')
  print('stakeholder_id get')
  return db.query(models.Stakeholder).filter(models.Stakeholder.id == id).first()

# フロントエンドから来たトークンを保存する
def create_stakeholder(db: Session, stakeholder:schemas.StakeHolderReq):
  db_stakeholder = models.Stakeholder(
    stakeholder_name=stakeholder.stakeholder_name,
    firebase_id=stakeholder.firebase_id
  )
  db.add(db_stakeholder)
  db.commit()
  db.refresh(db_stakeholder)
  return db_stakeholder

# stakeholderテーブルのfirebase_idを取得

def get_firebase_id(db:Session, firebase_id: str):
  return db.query(models.Stakeholder).filter(models.Stakeholder.firebase_id == firebase_id).first()

# Stakeholderのfirebase_idを更新
def update_firebase_id(db: Session, id: int, firebase_id: str):
  db_stakeholder = db.query(models.Stakeholder).filter(models.Stakeholder.id == id).first()
  if db_stakeholder:
    db_stakeholder.firebase_id = firebase_id
    db.commit()
    db.refresh(db_stakeholder)
    return db_stakeholder
  else:
    return None

# 新規登録（新しいstakeholder_idを取得）
def create_new_stakeholder(db: Session, firebase_id: str):
  stakeholder_id = uuid4()
  db_stakeholder = models.Stakeholder(
    id=stakeholder_id,
    stakeholder_name="",
    firebase_id=firebase_id
  )
  db.add(db_stakeholder)
  db.commit()
  db.refresh(db_stakeholder)
  return db_stakeholder

def update_stakeholder_name(db: Session, stakeholder_id: uuid4, stakeholder_name: str):
  db_stakeholder = db.query(models.Stakeholder).filter(models.Stakeholder.id == stakeholder_id).first()
  if db_stakeholder:
    db_stakeholder.stakeholder_name = stakeholder_name
    db.commit()
    db.refresh(db_stakeholder)
    return db_stakeholder
  else:
    return None