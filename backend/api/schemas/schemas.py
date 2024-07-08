from pydantic import BaseModel
from datetime import datetime
from uuid import UUID

class LoginReq(BaseModel):
  firebase_id: str

class LoginRes(BaseModel):
  firebase_id: str

class Error(BaseModel):
  error: str

class StakeHolderReq(BaseModel):
  stakeholder_name: str
  firebase_id: str

class StakeholderRes(BaseModel):
  message: str
  stakeholder_id: UUID


class UserReq(BaseModel):
  stakeholder_id: UUID
  adult_name: str
  child_name: str

class UserRes(BaseModel):
  message: str
  user_id: int


class PostChildReq(BaseModel):
  stakeholder_id: UUID
  child_name: str

class PostChildRes(BaseModel):
  message: str


class RecordBase(BaseModel):
    stakeholder_id: UUID
    with_member: str
    child_name: str
    events: str
    child_condition: str
    place: str
    share_start_at: datetime
    share_end_at: datetime

class RecordReq(RecordBase):
    pass

class RecordRes(BaseModel):
  message: str
  record_id: str

  class Config:
    from_attributes: True


class LLMReq(BaseModel):
  text: str
  stakeholder_id: UUID
  child_name: str
  year: str
  month: str

class LLMRes(BaseModel):
  summary: str
  sentiment: str


# とりあえずの確認用
class TimeShareRecordResponse(BaseModel):
  id: int
  stakeholder_id: UUID
  with_member: str
  child_name: str
  events: str
  child_condition: str
  place: str
  share_start_at: datetime
  share_end_at: datetime

  class Config:
    from_attributes = True