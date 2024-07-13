from pydantic import BaseModel
from datetime import datetime
from uuid import UUID
from typing import List, Dict, Any

# 支払いのためのリクエストとレスポンスモデル
class PaymentsReq(BaseModel):
  stakeholder_id: UUID
  user_id: int
class PaymentsRes(BaseModel):
  message: str
  payment_id: int

# エラー用 
class Error(BaseModel):
  error: str
