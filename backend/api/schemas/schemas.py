from pydantic import BaseModel
from typing import List, Dict, Any
import datetime
# 型定義たち
# エラー用
class Error(BaseModel):
  error: str


class stakeHolderReq(BaseModel):
  id: int
  stake_holder_name: str


class UserReq(BaseModel):
  stakeholder_id: int
  adult_name: str
  child_name: str

class UserRes(BaseModel):
  message: str
  user_id: int


class PostChildReq(BaseModel):
  stakeholder_id: int
  child_name: str

class PostChildRes(BaseModel):
  message: str


class RecordReq(BaseModel):
  stakeholder_id: int
  with_member: str
  child_name: str
  events: str
  child_condition: str
  place: str
  share_start_at: datetime
  share_end_at: datetime

class RecordRes(BaseModel):
  message: str
  record_id: str


class LLMReq(BaseModel):
  text: str
  stakeholder_id: int
  child_name: str
  year: str
  month: str

class LLMRes(BaseModel):
  summary: str
  sentiment: str