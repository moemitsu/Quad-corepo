from pydantic import BaseModel
from datetime import datetime
from uuid import UUID
from typing import List, Dict, Any

# 支払いのためのリクエストとレスポンスモデル
class StripeReq(BaseModel):
  stakeholder_id: UUID
  user_id: int
class StripeRes(BaseModel):
  message: str
  payment_id: int

# エラー用 
class Error(BaseModel):
  error: str
