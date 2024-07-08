import logging
from sqlalchemy.orm import Session
import api.database.models as models, api.schemas.schemas as schemas


# ユーザーを登録
def createUser(db: Session, stakeholder_id: int, adult_name: str, child_name: str):
  dbUser = models.User(stakeholder_id = stakeholder_id, adult_name=adult_name,child_name=child_name)
  db.add(dbUser)
  db.commit()
  db.refresh(dbUser)
  return dbUser

# ユーザーを編集
def updateUser(db: Session, user_id: int, adult_name: str, child_name: str):
  dbUser = db.query(models.User).filter(models.User.user_id == user_id).first()
  if dbUser:
    dbUser.adult_name = adult_name
    dbUser.child_name = child_name
    db.commit()
    db.refresh(dbUser)
    return dbUser
  else:
    return None
  
# userテーブルからadult_nameとchild_nameを取得
def get_adult_child_name(db: Session, stakeholder_id: str):
  db_user = db.query(models.User.adult_name, models.User.child_name).filter(models.User.stakeholder_id == stakeholder_id).all()