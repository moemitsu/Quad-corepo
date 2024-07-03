from sqlalchemy import String, Column, Integer, ForeignKey, DateTime
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.ext.declarative import declarative_base
from backend.api.database.db import Base
from uuid import uuid4

# データモデルの作成
# sqlalchemyによってデータベースのテーブルが生成

class User(Base):
  __tablename__ = 'User'
  id = Column(Integer, UUID(), nullable=False, primary_key=True, autoincrement= True)  # intで連番で採番される
  user_name = Column(String(), nullable=False)

class Payments(Base):
  __tablename__ = 'Payments'
  id = Column(Integer, UUID(), nullable=False, primary_key=True, autoincrement= True)  # intで連番で採番される
  user_id = Column(UUID(), ForeignKey('user.id'), nullable=False, primary_key=True)

class TimeShareRecords(Base):
  __tablename__ = 'TimeShareRecords'

  id = Column(Integer, UUID(), nullable=False, primary_key=True, autoincrement= True)  # intで連番で採番される
  user_id = Column(UUID(), ForeignKey('user.id'), nullable=False, primary_key=True)
  with_member = Column(String(), nullable=False)
  child_name = Column(String(), nullable=False)
  events = Column(String(), nullable=False)
  child_condition = Column(String(), nullable=False)
  place = Column(String(), nullable=False)
  share_start_at = Column(DateTime, nullable=False)
  share_end_at = Column(DateTime, nullable=False)