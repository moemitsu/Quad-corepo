from sqlalchemy import String, Column, Integer, ForeignKey, DateTime
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship
from backend.api.database.db import Base
from uuid import uuid4

# データモデルの作成
# sqlalchemyによってデータベースのテーブルが生成

class Stakeholder(Base):
  __tablename__ = 'Stakeholder'
  id = Column(Integer, UUID(), nullable=False, primary_key=True, autoincrement= True)  # intで連番で採番される
  stakeholder_name = Column(String(), nullable=False)
  firebase_id = Column(String(), nullable=False)

class Payments(Base):
  __tablename__ = 'Payments'
  id = Column(Integer, UUID(), nullable=False, primary_key=True, autoincrement= True)  # intで連番で採番される
  stakeholder_id = Column(Integer, ForeignKey('Stakeholder.id'), nullable=False, primary_key=True)
  user_id = Column(Integer, ForeignKey('User.id'), nullable=False)

class User(Base):
  __tablename__ = 'User'
  id = Column(Integer, UUID(), nullable=False, primary_key=True, autoincrement= True)  # intで連番で採番される
  stakeholder_id = Column(Integer, ForeignKey('Stakeholder.id'), nullable=False)
  adult_name = Column(String(), nullable=False)
  child_name = Column(String(), nullable=False)

class TimeShareRecords(Base):
  __tablename__ = 'TimeShareRecords'
  id = Column(Integer, UUID(), nullable=False, primary_key=True, autoincrement= True)  # intで連番で採番される
  stakeholder_id = Column(Integer, ForeignKey('Stakeholder.id'), nullable=False, primary_key=True)
  with_member = Column(String(), ForeignKey('User.adult_name'), nullable=False)
  child_name = Column(String(), ForeignKey('User.child_name'), nullable=False)
  events = Column(String(), nullable=False)
  child_condition = Column(String(), nullable=False)
  place = Column(String(), nullable=False)
  share_start_at = Column(DateTime, nullable=False)
  share_end_at = Column(DateTime, nullable=False)