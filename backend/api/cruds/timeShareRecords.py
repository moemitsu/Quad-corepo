from logging import config, getLogger
from sqlalchemy.orm import Session
from sqlalchemy import and_, func
from uuid import UUID
import datetime
import calendar

from api.database import models
from api.schemas import schemas

#TODO:不要であれば削除
#logger = logging.getLogger(f'custom.{__name__}')

logger = getLogger(__name__)


# クエリパラメータをもとにTimeShareRecordsテーブルから特定月のデータを取得
def get_records_by_month(db: Session, child_name: str, year: int, month: int):
    logger.info(f"Fetching Records by Month: {month}")
    start_date = datetime.datetime(year, month, 1)
    last_day = calendar.monthrange(year, month)[1]
    end_date = datetime.datetime(year, month, last_day, 23, 59, 59)

    return db.query(models.TimeShareRecords).filter(
        and_(
            models.TimeShareRecords.child_name == child_name,
            models.TimeShareRecords.share_start_at >= start_date,
            models.TimeShareRecords.share_end_at <= end_date
        )
    ).all()

# 棒グラフ用データ取得＆計算
def get_bar_graph_by_month(db: Session, stakeholder_id: UUID, child_name: str, year: int, month: int):
    start_date = datetime.datetime(year, month, 1)
    last_day = calendar.monthrange(year, month)[1]
    end_date = datetime.datetime(year, month, last_day, 23, 59, 59)
    
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
    
    return records

# 円グラフ用データの取得&計算
def get_pie_graph_by_month(db: Session, stakeholder_id: UUID, child_name: str, year: int, month: int):

    start_date = datetime.datetime(year, month, 1)
    last_day = calendar.monthrange(year, month)[1]
    end_date = datetime.datetime(year, month, last_day, 23, 59, 59)
    
    total_time = db.query(
        func.sum(func.extract('epoch', models.TimeShareRecords.share_end_at - models.TimeShareRecords.share_start_at) / 3600)
    ).filter(
        and_(
            models.TimeShareRecords.stakeholder_id == stakeholder_id,
            models.TimeShareRecords.child_name == child_name,
            models.TimeShareRecords.share_start_at >= start_date,
            models.TimeShareRecords.share_end_at <= end_date
        )
    ).scalar()
    
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
    
    if total_time == 0:
        return [(record.with_member, 0) for record in records]
    
    return [(record.with_member, (record.total_hours / total_time) * 100) for record in records]


# 記録の追加
def create_record(db: Session, stakeholder_id: UUID, with_member: str, child_name: str, events: str, child_condition: str, place: str, share_start_at: datetime, share_end_at: datetime):
    logger.info(f"Creating Record: Child={child_name}, Start={share_start_at}, End={share_end_at}")
    new_record = models.TimeShareRecords(
        stakeholder_id=stakeholder_id,
        with_member=with_member,
        child_name=child_name,
        events=events,
        child_condition=child_condition,
        place=place,
        share_start_at=share_start_at,
        share_end_at=share_end_at
    )
    logger.info(new_record)
    db.add(new_record)
    db.commit()
    db.refresh(new_record)
    return new_record

# LLMに分析してもらうためのデータを取得
def get_records_analysis(db: Session, stakeholder_id: UUID, child_name: str):
    logger.info(f"Fetching Records for Analysis: Child={child_name}")
    return db.query(models.TimeShareRecords).filter(
        and_(
            models.TimeShareRecords.stakeholder_id == stakeholder_id,
            models.TimeShareRecords.child_name == child_name
        )
    ).all()

# 確認用　TimeShareRecordsのデータをすべて取得する関数
def get_all_records(db: Session):
    logger.info("Fetching all Records")
    return db.query(models.TimeShareRecords).all()
