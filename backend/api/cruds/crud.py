from fastapi import FastAPI, HTTPException, Depends, Query
from typing import Optional, Dict, Any
from data import users, children, records
from sqlalchemy.orm import Session
from database import SessionLocal, engine
import dataModels, data, database
from dataModels import LoginReq, LoginRes, UserReq, UserRes,PostChildReq, PostChildRes, RecordReq, RecordRes, LLMReq, LLMRes, Error
import jwt  # pip install PyJWTしてね

models.Base.metadata.create_all(bind=engine)

app = FastAPI()

# # ここから実際のアプリのやつ
# def loginUser(email: str, password: str):
#   # 簡易的な（とりあえずの）認証ロジック
#   if email == 'test@test.com' and password == 'password':
#     return {'user_id': '12345'}
#   raise HTTPException(status_code=401, detail='メールアドレスかパスワードが間違っています。')

# def getCurrentUser(token: str = Depends(lambda: '')):
#   try:
#     payload = jwt.decode(token, 'my-secret-key', algorithms=['HS256'])
#     return payload
#   except jwt.PyJWTError:
#     raise HTTPException(status_code=401, detail='トークンが不正です。')

def getDB():
  db = SessionLocal()
  try:
    yield db
  finally:
    db.close()

# ログイン
@app.post("/api/v1/auth/login", response_model=LoginRes, responses={401: {'model': Error}})
def login(user: schemas.LoginReq, db: Session = Depends(get_db)):
  db_user = crud.email
  if db_user:
    raise HTTPException(status_code=400, detail='既に登録済みのEメールアドレスです')

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
