from sqlalchemy.orm import Session
import models, backend.api.schemas.schemas as schemas

# データベースと直接やりとりする関数。
# この関数をもとにCRUD処理を動かしてフロントエンドにレスポンスする。
def getUser(db: Session, user_id: int):
  return db.query(models.User).filter(models.User.id == user_id).first()

