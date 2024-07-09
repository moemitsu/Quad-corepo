import logging
from sqlalchemy.orm import Session
import api.database.models as models, api.schemas.schemas as schemas

# ユーザーを登録
def create_user(db: Session, stakeholder_id: int, adult_name: str, child_name: str):
  db_user = models.User(stakeholder_id = stakeholder_id, adult_name=adult_name,child_name=child_name)
  db.add(db_user)
  db.commit()
  db.refresh(db_user)
  return db_user

# ユーザーを編集
def update_user(db: Session, user_id: int, adult_name: str, child_name: str):
  db_user = db.query(models.User).filter(models.User.user_id == user_id).first()
  if db_user:
    db_user.adult_name = adult_name
    db_user.child_name = child_name
    db.commit()
    db.refresh(db_user)
    return db_user
  else:
    return None
  
# userテーブルからadult_nameとchild_nameを取得
def get_adult_child_name(db: Session, stakeholder_id: str):
  return db.query(models.User.adult_name, models.User.child_name).filter(models.User.stakeholder_id == stakeholder_id).all()