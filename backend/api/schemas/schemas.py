from pydantic import BaseModel
from datetime import datetime
from uuid import UUID
from typing import List

# エラー用 
class Error(BaseModel):
  error: str

# ログイン済みのユーザーをヘッダーに表示させるため
class StakeholderRes(BaseModel):
  stakeholder_id: UUID
  stakeholder_name: str
  message: str

# 新規登録のためのリクエストとレスポンスモデル
class SignUpReq(BaseModel):
  stakeholder_name: str
  firebase_id: str
class SignUpRes(BaseModel):
  message: str
  stakeholder_id: UUID

# 登録済みの人がログインするため
class LoginReq(BaseModel):
  firebase_id: str
class LoginRes(BaseModel):
  firebase_id: str

# stakeholderテーブルへのリクエストボディ
class StakeHolderReq(BaseModel):
  stakeholder_name: str
  firebase_id: str
# レスポンス
class StakeholderRes(BaseModel):
  message: str
  stakeholder_id: UUID

# userテーブルへのリクエストボディ
class UserReq(BaseModel):
  stakeholder_id: UUID
  adult_names: List[str]  # 複数の成人名
  child_names: List[str]  # 複数の子供名
# レスポンス
class UserRes(BaseModel):
  message: str
  user_id: List[int]

# adult_nameとchild_nameの取得
class NamesRes(BaseModel):
  adult_names: List[str]  # 複数の成人名
  child_names: List[str]  # 複数の子供名

# 記録を追加するためのリクエスト
class RecordReq(BaseModel):
  with_member: str
  child_name: str
  events: str
  child_condition: str
  place: str
  share_start_at: datetime
  share_end_at: datetime
# レスポンス
class RecordRes(BaseModel):
  message: str
  record_id: int
  class Config:
    from_attributes = True

# 各月各子詳細データ取得用
class DetailListRes(BaseModel):
  with_member: str
  events: str
  child_condition: str
  place: str
  share_start_at: datetime
  share_end_at: datetime

# LLM用のリクエスト
class LLMReq(BaseModel):
  text: str
  stakeholder_id: UUID
  child_name: str
  year: str
  month: str
# レスポンス
class LLMRes(BaseModel):
  summary: str
  sentiment: str

# 確認用　FIXME 後で消す
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
  # class Config:
  #   from_attributes = True


# LLM動作確認用
class Completion(BaseModel):
    advice: str