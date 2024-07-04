from sqlalchemy.orm import Session
import backend.api.database.models as models, backend.api.schemas.schemas as schemas

# Userテーブルから利用者の名前を取得
def getStakeholder(db: Session, adult_name: str):
  return db.query(models.User).filter(models.User.adult_name == adult_name).first

# Userテーブルから子どもの名前を取得
def getChild(db: Session, child_name: str):
  return db.query(models.User).filter(models.User.child_name == child_name).first

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