from sqlalchemy.orm import Session
import backend.api.database.models as models, backend.api.schemas.schemas as schemas

# Userテーブルのidを取得
def getUserId(db: Session, id: int):
  return db.query(models.User).filter(models.User.id == id).first()

# Userテーブルから利用者の名前を取得
def getStakeholder(db: Session, stakeholder_name: str):
  return db.query(models.User).filter(models.User.stakeholder_name == stakeholder_name).first

# Userテーブルから子どもの名前を取得
def getChild(db: Session, child_name: str):
  return db.query(models.User).filter(models.User.child_name == child_name).first

# ユーザーを登録
def createUser(db: Session, user: schemas.UserReq):
  dbUser = models.User(user_name = user.user_name)
  db.add(dbUser)
  db.commit()
  db.refresh(dbUser)
  return dbUser