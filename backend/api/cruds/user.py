import logging
from sqlalchemy.orm import Session
import api.database.models as models, api.schemas.schemas as schemas
from typing import List, Dict
from uuid import UUID
from api.database.models import User
from logging import config, getLogger

logger = getLogger(__name__)

# ユーザーを登録
def create_user(db: Session, stakeholder_id: int, adult_name: str, child_name: str):
    if not adult_name and not child_name:
        raise ValueError('Either adult_name or child_name must be provided.')
    db_user = models.User(stakeholder_id = stakeholder_id, adult_name=adult_name, child_name=child_name)
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
    
# userテーブルからadult_nameとchild_nameを取得→取得できず
# def get_adult_child_name(db: Session, stakeholder_id: str):
#   return db.query(models.User.adult_name, models.User.child_name).filter(models.User.stakeholder_id == stakeholder_id).all()

# 新しいget_names関数の追加
def get_names(db: Session, stakeholder_id: int) -> Dict[str, List[str]]:
    users = db.query(User).filter(User.stakeholder_id == stakeholder_id).all()
    if not users:
        logger.error(f"No users found for stakeholder_id: {stakeholder_id}")
    # adult_name と child_name のリストを作成
    adult_names = [user.adult_name for user in users if user.adult_name]
    child_names = [user.child_name for user in users if user.child_name]
    
    logger.info(f"Adult names: {adult_names}, Child names: {child_names}")
    
    return {"adult_names": adult_names, "child_names": child_names}