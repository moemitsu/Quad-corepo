from sqlalchemy import String, Column, UUID, ForeignKey, TIMESTAMP
from sqlalchemy.ext.declarative import declarative_base
from api.database.db import Base
from uuid import uuid4

# データモデルの作成
# sqlalchemyによってデータベースのテーブルが生成

class Stakeholder(Base):
  __tablename__ = 'Stakeholder'
  id = Column(UUID(as_uuid=True), primary_key=True, default=uuid4,  nullable=False)
  stakeholder_name = Column(String(), nullable=False)

class User(Base):
  __tablename__ = 'User'
  id = Column(UUID(as_uuid=True), primary_key=True, default=uuid4, nullable=False)
  stakeholder_id = Column(UUID(as_uuid=True), ForeignKey('Stakeholder.id'), nullable=False)
  adalt_name = Column(String())
  child_name = Column(String())

class Payments(Base):
  __tablename__ = 'Payments'
  id = Column(UUID(as_uuid=True), primary_key=True, default=uuid4, nullable=False)
  user_id = Column(UUID(as_uuid=True), ForeignKey('User.id'), nullable=False)
  stakeholder_id = Column(UUID(as_uuid=True), ForeignKey('Stakeholder.id'), nullable=False)

class TimeShareRecords(Base):
  __tablename__ = 'TimeShareRecords'
  id = Column(UUID(as_uuid=True), primary_key=True, default=uuid4, nullable=False)
  stakeholder_id = Column(UUID(as_uuid=True), ForeignKey('Stakeholder.id'), nullable=False)
  with_member = Column(String(), nullable=False)
  child_name = Column(String(), nullable=False)
  events = Column(String(), nullable=False)
  child_condition = Column(String(), nullable=False)
  place = Column(String(), nullable=False)
  share_start_at = Column(TIMESTAMP, nullable=False)
  share_end_at = Column(TIMESTAMP, nullable=False)