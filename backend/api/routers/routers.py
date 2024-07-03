from fastapi import FastAPI, HTTPException, Depends, Query
from typing import Optional, Dict, Any
from sqlalchemy.orm import Session
from database import SessionLocal, engine
import backend.api.schemas.schemas as schemas, data, database
from backend.api.schemas.schemas import UserReq, UserRes,PostChildReq, PostChildRes, RecordReq, RecordRes, LLMReq, LLMRes, Error
import jwt
from . import models, crud, database

models.Base.metadata.create_all(bind=engine)

app = FastAPI()

def getDB():
  db = database.SessionLocal()
  try:
    yield db
  finally:
    db.close()

# ユーザー情報登録
@app.post('/api/v1/user', response_model=UserRes, responses={400: {'model': Error}})
def postUser(request: UserReq, token: str = Depends(lambda: '')):
  # とりあえずのロジック
  user_id = '12345'
  users[user_id] = {
    'email': request.email,
    'user_name': request.user_name,
    'children_names': request.children_names
  }
  return {'message': '登録に成功しました', 'user_id': user_id}

# ユーザー情報編集
@app.put('/api/v1/user/{user_id}', response_model=UserReq, responses={400: {'model': Error}})
def updateUser(user_id: str, request: UserReq, token: str = Depends(lambda: '')):
  # とりあえずのロジック
  if user_id in users:
    users[user_id].update({
      'user_name': request.user_name,
      'children_names': request.children_names
    })
    return {'message': '情報を更新しました。', 'user_id': user_id}
  else:
    raise HTTPException(status_code=400, detail='ユーザーが見つかりません。')

# 子どもの追加
@app.post('/api/v1/user/{user_id}/children', response_model=PostChildRes, responses={400: {'model': Error}})
def addChild(user_id: str, request: PostChildReq, token: str = Depends(lambda: '')):
  # とりあえずのロジック
  child_id = '54321'
  children[child_id] = {
    'child_name': request.child_name,
    'user_id': user_id
  }
  return {'child_id': child_id}



# 各月画面の情報を取得
@app.get('/api/v1/main', responses={200: {'model': Dict[str, Any]}, 400: {'model': Error}})
def getMainData(child_name: str, year: str, month: str,db: Session = Depends(getDB)):
  records = crud.getRecordsByMonth(db, child_name, year, month)
  if not records:
    raise HTTPException(status_code=404, detail='記録が見つかりません')
  return records



# 記録の追加
@app.post('/api/v1/records', response_model=RecordRes, responses={400: {'model': Error}})
def addRecord(request: RecordReq, token: str = Depends(lambda: '')):
  # とりあえずのロジック
  record_id = '67890'
  records.append({
    'record_id': record_id,
    'user_id': request.user_id,
    'child_name': request.child_name,
    'activity': request.activity,
    'start_time': request.start_time,
    'end_time': request.end_time
  })
  return {'message': '記録を追加しました。', 'record_id': record_id}

# 子どもの名前だけ取得するメソッド。

# LLM分析
@app.post('/api/v1/analysis', response_model=LLMRes, responses={400: {'model': Error}})
def getLlmAnalysis(request: LLMReq, token: str = Depends(lambda: '')):
  # TODO LLM分析機能の実装
  return {'summary': 'LLMによる要約', 'sentiment': 'ポジティブ'}
