from pydantic import BaseModel
from datetime import datetime
from uuid import UUID
from typing_extensions import Literal
from typing import List, Dict, Any, Optional

# エラー用 
class Error(BaseModel):
  error: str

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
  stakeholder_id: UUID
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

# とりあえずの確認用　FIXME 後で消す
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

# LLM動作確認用

class Logprobs(BaseModel):
    text_offset: Optional[List[int]] = None
    token_logprobs: Optional[List[float]] = None
    tokens: Optional[List[str]] = None
    top_logprobs: Optional[List[Dict[str, float]]] = None

class CompletionChoice(BaseModel):
    finish_reason: Literal["stop", "length", "content_filter"]
    index: int
    logprobs: Optional[Logprobs] = None
    text: str

class CompletionUsage(BaseModel):
    completion_tokens: int
    prompt_tokens: int
    total_tokens: int

class Completion(BaseModel):
    id: str
    choices: List[CompletionChoice]
    created: int
    model: str
    object: Literal["text_completion"]
    system_fingerprint: Optional[str] = None
    usage: Optional[CompletionUsage] = None