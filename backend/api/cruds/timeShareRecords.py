from logging import config, getLogger
from sqlalchemy.orm import Session
from sqlalchemy import and_, func
from uuid import UUID
import datetime
import calendar
from fastapi import HTTPException

from api.database import models
from api.schemas import schemas

logger = getLogger(__name__)


# クエリパラメータをもとにTimeShareRecordsテーブルから特定月のデータを取得（UUIDなし）
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

# 詳細一覧の取得　グラフに合わせて、各月各子の一覧とする
def get_each_detail_lists_by_month(db: Session, stakeholder_id: UUID, child_name: str, year: int, month: int):
    try:
        start_date = datetime.datetime(year, month, 1)
        last_day = calendar.monthrange(year, month)[1]
        end_date = datetime.datetime(year, month, last_day, 23, 59, 59)
        records = db.query(models.TimeShareRecords).filter(
            models.TimeShareRecords.stakeholder_id == stakeholder_id,
            models.TimeShareRecords.child_name == child_name,
            models.TimeShareRecords.share_start_at >= start_date,
            models.TimeShareRecords.share_end_at <= end_date
        ).order_by(models.TimeShareRecords.share_start_at).all()
        logger.info(f'timeShareRecords102------------------------------------familydata{records}')
        return records
    except Exception as e:
        logger.error(f"Error fetching records: {e}")
        raise HTTPException(status_code=500, detail="記録の取得中にエラーが発生しました")

# 全月の全ての子の詳細一覧の取得
def get_each_detail_lists_by_month_for_all_children(db: Session, stakeholder_id: UUID, year: int):
    try:
        records = []
        for month in range(1, 13):  # 1から12までの月をループで処理
            start_date = datetime.datetime(year, month, 1)
            last_day = calendar.monthrange(year, month)[1]
            end_date = datetime.datetime(year, month, last_day, 23, 59, 59)
            month_records = db.query(models.TimeShareRecords).filter(
                models.TimeShareRecords.stakeholder_id == stakeholder_id,
                models.TimeShareRecords.share_start_at >= start_date,
                models.TimeShareRecords.share_end_at <= end_date
            ).order_by(models.TimeShareRecords.share_start_at).all()
            records.extend(month_records)
        
        logger.info(f'timeShareRecords103------------------------------------familydata{records}')
        return records
    except Exception as e:
        logger.error(f"Error fetching records: {e}")
        raise HTTPException(status_code=500, detail="記録の取得中にエラーが発生しました")
    
# 記録の追加
def create_record(db: Session, stakeholder_id: UUID, with_member: str, child_name: str, events: str, child_condition: str, place: str, share_start_at: datetime, share_end_at: datetime):
    logger.info(f"Creating Record: Child={child_name}, Start={share_start_at}, End={share_end_at}")
    try:
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
    except Exception as e:
        logger.error(f"Error creating record: {e}")
        raise


# LLMに分析してもらうためのデータを取得
def get_records_by_month_for_llm(db: Session, stakeholder_id: int, child_name: str, year: int, month: int):
    start_date = f"{year}-{month}-01"
    end_date = f"{year}-{month}-{calendar.monthrange(year, month)[1]}"
    return db.query(
        models.TimeShareRecords.with_member,
        models.TimeShareRecords.child_name,
        models.TimeShareRecords.events,
        models.TimeShareRecords.child_condition,
        models.TimeShareRecords.place,
        models.TimeShareRecords.share_start_at,
        models.TimeShareRecords.share_end_at
    ).filter(
        and_(
            models.TimeShareRecords.stakeholder_id == stakeholder_id,
            models.TimeShareRecords.child_name == child_name,
            models.TimeShareRecords.share_start_at >= start_date,
            models.TimeShareRecords.share_end_at <= end_date
        )
    ).all()

# 確認用　TimeShareRecordsのデータをすべて取得する関数
def get_all_records(db: Session):
    logger.info("Fetching all Records")
    return db.query(models.TimeShareRecords).all()

