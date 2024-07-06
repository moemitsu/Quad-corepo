from sqlalchemy.orm import Session
from sqlalchemy import and_
import api.database.models as models, api.schemas.schemas as schemas
import datetime
import calendar

# データベースと直接やりとりする関数。
# この関数をもとにCRUD処理を動かしてフロントエンドにレスポンスする。

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

# 記録の追加
def createRecords(db: Session, stakeholder_id: int, with_member: str,child_name: str,events: str, child_condition: str, place :str, share_start_at: datetime, share_end_at: datetime):
  newRecords = models.TimeShareRecords(
    stakeholder_id = stakeholder_id,
    with_member = with_member,
    child_name = child_name,
    events = events,
    child_condition = child_condition,
    place = place,
    share_start_at = share_start_at,
    share_end_at = share_end_at
  )
  db.add(newRecords)
  db.commit()
  db.refresh(newRecords)
  return newRecords

# LLMに分析してもらうためのデータを取得
def getRecordsAnalysis(db: Session, stakeholder_id: int, child_name: str):
  return db.query(models.TimeShareRecords).filter(
    and_(
      models.TimeShareRecords.stakeholder_id == stakeholder_id,
      models.TimeShareRecords.child_name == child_name
    )
  ).all()