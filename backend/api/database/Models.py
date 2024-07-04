from sqlalchemy import String, Column, ForeignKey, TIMESTAMP, Integer
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship
from api.database.db import Base
from uuid import uuid4

class Stakeholder(Base):
  __tablename__ = 'Stakeholder'
  id = Column(UUID(as_uuid=True), default=uuid4, nullable=False, primary_key=True)
  stakeholder_name = Column(String(), nullable=False)
  firebase_id = Column(String())

class User(Base):
  __tablename__ = 'User'
  id = Column(UUID(as_uuid=True), primary_key=True, default=uuid4, nullable=False)
  stakeholder_id = Column(ForeignKey('Stakeholder.id'), nullable=False)
  adult_name = Column(String())
  child_name = Column(String())

class Payments(Base):
  __tablename__ = 'Payments'
  id = Column(UUID(as_uuid=True), default=uuid4, nullable=False, primary_key=True)
  stakeholder_id = Column(ForeignKey('Stakeholder.id'), nullable=False, primary_key=True)
  user_id = Column(ForeignKey('User.id'), nullable=False)

class TimeShareRecords(Base):
  __tablename__ = 'TimeShareRecords'
  id = Column(UUID(as_uuid=True), primary_key=True, default=uuid4, nullable=False)
  stakeholder_id = Column(ForeignKey('Stakeholder.id'), nullable=False)
  with_member = Column(String(), nullable=False)
  child_name = Column(String(), nullable=False)
  events = Column(String(), nullable=False)
  child_condition = Column(String(), nullable=False)
  place = Column(String(), nullable=False)
  share_start_at = Column(TIMESTAMP, nullable=False)
  share_end_at = Column(TIMESTAMP, nullable=False)