from sqlalchemy import String, Column, UUID, ForeignKey, TIMESTAMP
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship
from api.database.db import Base
from uuid import uuid4

class Stakeholder(Base):
  __tablename__ = 'Stakeholder'
  id = Column(UUID(as_uuid=True), default=uuid4, nullable=False, primary_key=True, autoincrement= True)
  stakeholder_name = Column(String(), nullable=False)
  firebase_id = Column(String(), nullable=False)

class Payments(Base):
  __tablename__ = 'Payments'
  id = Column(Integer, UUID(), nullable=False, primary_key=True, autoincrement= True)
  stakeholder_id = Column(Integer, ForeignKey('Stakeholder.id'), nullable=False, primary_key=True)
  user_id = Column(Integer, ForeignKey('User.id'), nullable=False)

class User(Base):
  __tablename__ = 'User'
  id = Column(UUID(as_uuid=True), primary_key=True, default=uuid4, nullable=False, autoincrement= True)
  stakeholder_id = Column(UUID(as_uuid=True), ForeignKey('Stakeholder.id'), nullable=False)
  adult_name = Column(String())
  child_name = Column(String())

class TimeShareRecords(Base):
  __tablename__ = 'TimeShareRecords'
  id = Column(UUID(as_uuid=True), primary_key=True, default=uuid4, nullable=False, autoincrement= True)
  stakeholder_id = Column(UUID(as_uuid=True), ForeignKey('Stakeholder.id'), nullable=False)
  with_member = Column(String(), ForeignKey('User.adult_name'), nullable=False)
  child_name = Column(String(), ForeignKey('User.child_name'), nullable=False)
  events = Column(String(), nullable=False)
  child_condition = Column(String(), nullable=False)
  place = Column(String(), nullable=False)
  share_start_at = Column(TIMESTAMP, nullable=False)
  share_end_at = Column(TIMESTAMP, nullable=False)