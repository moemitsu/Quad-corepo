from logging import config, getLogger
from sqlalchemy.orm import Session
from sqlalchemy import and_, func
import api.database.models as models, api.schemas.schemas as schemas
import datetime
import calendar

logger = getLogger(__name__)

# クエリパラメータをもとにTimeShareRecordsテーブルから特定月のデータを取得
def get_records_by_month(db: Session, child_name: str, year: int, month: int):
  logger.info(f"Fetching RecordByMonth: {month}")
  start_date = datetime.datetime(year, month, 1) #年、月、1日
  last_day = calendar.monthrange(year, month)[1]
  end_date = datetime.datetime(year, month, last_day, 23, 59, 59) # 年、月、最終日、23:59:59

  return  db.query(models.TimeShareRecords).filter(
    and_(
      models.TimeShareRecords.child_name == child_name,
      models.TimeShareRecords.share_start_at >= start_date,
      models.TimeShareRecords.share_end_at <= end_date
    )
  ).all()

# 棒グラフ用データ取得＆計算
def get_bar_graph_by_month(db: Session, stakeholder_id: str, child_name: str, year: int, month: int):
  start_date = datetime.datetime(year, month, 1) #年、月、1日
  last_day = calendar.monthrange(year, month)[1]
  end_date = datetime.datetime(year, month, last_day, 23, 59, 59) # 年、月、最終日、23:59:59
  records = db.query(
    models.TimeShareRecords.with_member,
    func.date(models.TimeShareRecords.share_start_at).label('date'),
    func.sum(func.extract('epoch', models.TimeShareRecords.share_end_at - models.TimeShareRecords.share_start_at) / 3600).label('total_hours')
  ).filter(
    and_(
      models.TimeShareRecords.stakeholder_id == stakeholder_id,
      models.TimeShareRecords.child_name == child_name,
      models.TimeShareRecords.share_start_at >= start_date,
      models.TimeShareRecords.share_end_at <= end_date
    )
  ).group_by(
    models.TimeShareRecords.with_member,
    func.date(models.TimeShareRecords.share_start_at)
  ).all()

# 円グラフ用データの取得&計算
def get_pie_graph_by_month(db: Session, stakeholder_id: int, child_name: str, year: int, month: int):
  start_date = datetime.datetime(year, month, 1) #年、月、1日
  last_day = calendar.monthrange(year, month)[1]
  end_date = datetime.datetime(year, month, last_day, 23, 59, 59) # 年、月、最終日、23:59:59
  logger.info(f'Start Date: {start_date}, End Date: {end_date}')
  print('Start Date: {start_date}, End Date: {end_date}')
  total_time = db.query(
    func.sum(func.extract('epoch',models.TimeShareRecords.share_end_at - models.TimeShareRecords.share_start_at) / 3600)
  ).filter(
    and_(
      models.TimeShareRecords.stakeholder_id == stakeholder_id,
      models.TimeShareRecords.child_name == child_name,
      models.TimeShareRecords.share_start_at >= start_date,
      models.TimeShareRecords.share_end_at <= end_date
    )
  ).scalar()
  
  logger.debug(f'Total Time: {total_time}')
  print('Total Time: {total_time}')
  records = db.query(
    models.TimeShareRecords.with_member,
    func.sum(func.extract('epoch', models.TimeShareRecords.share_end_at - models.TimeShareRecords.share_start_at) / 3600).label('total_hours')
  ).filter(
    and_(
      models.TimeShareRecords.stakeholder_id == stakeholder_id,
      models.TimeShareRecords.child_name == child_name,
      models.TimeShareRecords.share_start_at >= start_date,
      models.TimeShareRecords.share_end_at <= end_date
    )
  ).group_by(
    models.TimeShareRecords.with_member
  ).all()
  
  logger.debug(f'Records: {records}')
  
  if total_time == 0:
    return [(record.with_member, 0) for record in records]
  
  return [(record.with_member, (record.total_hours / total_time) * 100) for record in records]



# 記録の追加
def create_records(db: Session, stakeholder_id: int, with_member: str,child_name: str,events: str, child_condition: str, place :str, share_start_at: datetime, share_end_at: datetime):
  logger.info(f"Fetching createRecords: {child_name}&from{share_start_at}to{share_end_at}")
  new_records = models.TimeShareRecords(
    stakeholder_id = stakeholder_id,
    with_member = with_member,
    child_name = child_name,
    events = events,
    child_condition = child_condition,
    place = place,
    share_start_at = share_start_at,
    share_end_at = share_end_at
  )
  db.add(new_records)
  db.commit()
  db.refresh(new_records)
  return new_records

# LLMに分析してもらうためのデータを取得
def get_records_analysis(db: Session, stakeholder_id: int, child_name: str):
  logger.info(f"Fetching getRecordsAnalysis: {child_name}")
  return db.query(models.TimeShareRecords).filter(
    and_(
      models.TimeShareRecords.stakeholder_id == stakeholder_id,
      models.TimeShareRecords.child_name == child_name
    )
  ).all()

# 確認用　TimeShareRecordsのデータをすべて取得する関数
def get_all_records(db: Session):
    return db.query(models.TimeShareRecords).all()