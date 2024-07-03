from sqlalchemy.orm import Session
from sqlalchemy import and_
import models, backend.api.schemas.schemas as schemas
import datetime
import calendar

# データベースと直接やりとりする関数。
# この関数をもとにCRUD処理を動かしてフロントエンドにレスポンスする。

# Userテーブルのidを取得
def getUserId(db: Session, id: int):
  return db.query(models.User).filter(models.User.id == id).first()
# Paymentsテーブルのid取得
def getPaymentsId(db: Session, id: int):
  return db.query(models.Payments).filter(models.Payments.id == id)

# クエリパラメータをもとにTimeShareRecordsテーブルから特定月のデータを取得
def getRecordsByMonth(db: Session, child_name: str, year: int, month: int):
  startDate = datetime.datetime(year, month, 1) #年、月、1日
  lastDay = calendar.monthrange(year, month)[1]
  endDate = datetime.datetime(year, month, lastDay, 23, 59, 59) # 年、月、最終日、23:59:59

  return  db.query(models.TimeShareRecords).filter(
    and_(
      models.TimeShareRecords.child_name == child_name,
      models.TimeShareRecords.share_start_at >= startDate,
      models.TimeShareRecords.share_end_at <= endDate
    )
  ).all()

