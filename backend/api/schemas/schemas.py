from fastapi import FastAPI, HTTPException, Depends, Path, Query, Body
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
from datetime import datetime, timedelta
# 型定義たち
# エラー用
class Error(BaseModel):
  error: str

# 関係者登録
class stakeHolderReq(BaseModel):
  id: int
  stake_holder_name: str

# ユーザー登録用型定義
class UserReq(BaseModel):
  user_name: List[str]
  children_names: List[str]

class UserRes(BaseModel):
  message: str
  user_id: str

# 子供追加
class PostChildReq(BaseModel):
  child_name: str

class PostChildRes(BaseModel):
  child_id: str

class RecordReq(BaseModel):
  user_id: str
  child_name: str
  activity: str
  start_time: str
  end_time: str

# 記録の追加の
class RecordRes(BaseModel):
  message: str
  record_id: str

class LLMReq(BaseModel):
  text: str
  user_id: str
  child_name: str
  month: str
  activities: List[Dict[str, Any]]

class LLMRes(BaseModel):
  summary: str
  sentiment: str