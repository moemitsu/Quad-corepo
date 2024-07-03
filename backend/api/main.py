from fastapi import FastAPI, HTTPException, Depends, Path, Query, Body
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
import jwt  # pip install PyJWTしてね
from datetime import datetime, timedelta

# ベタ打ちデータ
users = {
  "12345": {
    "email": "test@test.com",
    "user_name": ["User A", "User B"],
    "children_names": ["Child One", "Child Two"]
  }
}

children = {
  "54321": {
    "child_name": "Child One",
    "user_id": "12345"
  }
}

records = [
  {
    "record_id": "67890",
    "user_id": "12345",
    "child_name": "Child One",
    "activity": "Reading",
    "start_time": "2024-06-01T10:00:00",
    "end_time": "2024-06-01T11:00:00"
  }
]

# 型定義たち
# ログイン用型定義
class LoginReq(BaseModel):
  email: str
  password: str

class LoginRes(BaseModel):
  token: str

class Error(BaseModel):
  error: str

# ユーザー登録用型定義
class UserReq(BaseModel):
  email: str
  password: str
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
# 型定義ここまで

# FastAPIをインスタンス化する
app = FastAPI()

# 初期のやつ
@app.get("/")
async def index():
  return {"message": "Hello World"}

# ここから実際のアプリのやつ
def loginUser(email: str, password: str):
  # 簡易的な（とりあえずの）認証ロジック
  if email == 'test@test.com' and password == 'password':
    return {'user_id': '12345'}
  raise HTTPException(status_code=401, detail='メールアドレスかパスワードが間違っています。')

def getCurrentUser(token: str = Depends(lambda: '')):
  try:
    payload = jwt.decode(token, 'my-secret-key', algorithms=['HS256'])
    return payload
  except jwt.PyJWTError:
    raise HTTPException(status_code=401, detail='トークンが不正です。')

# ログイン
@app.post("/api/v1/auth/login", response_model=LoginRes, responses={401: {'model': Error}})
def login(request: LoginReq):
  try:
    user = loginUser(request.email, request.password)
    token = jwt.encode(user, 'my-secret-key', algorithm='HS256')
    return {'token': token}
  except HTTPException as e:
    raise e

# ユーザー情報登録
@app.post("/api/v1/user", response_model=UserRes, responses={400: {"model": Error}})
def postUser(request: UserReq, token: str = Depends(lambda: '')):
  # とりあえずのロジック
  user_id = "12345"
  users[user_id] = {
    "email": request.email,
    "user_name": request.user_name,
    "children_names": request.children_names
  }
  return {"message": "登録に成功しました", "user_id": user_id}

# ユーザー情報編集
@app.put("/api/v1/user/{user_id}", response_model=UserReq, responses={400: {"model": Error}})
def updateUser(user_id: str, request: UserReq, token: str = Depends(lambda: '')):
  # とりあえずのロジック
  if user_id in users:
    users[user_id].update({
      "user_name": request.user_name,
      "children_names": request.children_names
    })
    return {"message": "情報を更新しました。", "user_id": user_id}
  else:
    raise HTTPException(status_code=400, detail="ユーザーが見つかりません。")

# 子どもの追加
@app.post("/api/v1/user/{user_id}/children", response_model=PostChildRes, responses={400: {"model": Error}})
def addChild(user_id: str, request: PostChildReq, token: str = Depends(lambda: '')):
  # とりあえずのロジック
  child_id = "54321"
  children[child_id] = {
    "child_name": request.child_name,
    "user_id": user_id
  }
  return {"child_id": child_id}

# 各月画面の情報を取得
@app.get("/api/v1/main", responses={200: {"model": Dict[str, Any]}, 400: {"model": Error}})
def getMainData(month: str = Query(...), child_name: Optional[str] = Query(None), token: str = Depends(lambda: '')):
  # とりあえずのロジック
  return {
    "summary": {
      "dates": [
        {
          "date": "2024-06-01",
          "activities": [
            {
              "user_name": "User One",
              "activity": "Reading",
              "start_time": "10:00",
              "end_time": "11:00"
            }
          ]
        }
      ],
      "ratios": {
        "User One": 50,
        "User Two": 50
      }
    },
    "analysis": {
      "llm_summary": "LLMの要約結果",
      "llm_sentiment": "ポジティブ"
    }
  }

# 記録の追加
@app.post("/api/v1/records", response_model=RecordRes, responses={400: {"model": Error}})
def addRecord(request: RecordReq, token: str = Depends(lambda: '')):
  # とりあえずのロジック
  record_id = "67890"
  records.append({
    "record_id": record_id,
    "user_id": request.user_id,
    "child_name": request.child_name,
    "activity": request.activity,
    "start_time": request.start_time,
    "end_time": request.end_time
  })
  return {"message": "記録を追加しました。", "record_id": record_id}

# LLM分析
@app.post("/api/v1/analysis", response_model=LLMRes, responses={400: {"model": Error}})
def getLlmAnalysis(request: LLMReq, token: str = Depends(lambda: '')):
  # TODO LLM分析機能の実装
  return {"summary": "LLMによる要約", "sentiment": "ポジティブ"}
