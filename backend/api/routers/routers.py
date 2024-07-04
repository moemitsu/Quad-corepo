from fastapi import FastAPI, HTTPException, Depends, Query
from typing import Optional, Dict, Any
from sqlalchemy.orm import Session
from database import SessionLocal, engine
import backend.api.database.models as models, backend.api.schemas.schemas as schemas, backend.api.cruds as crud , backend.api.database as database
from backend.api.schemas.schemas import UserReq, UserRes,PostChildReq, PostChildRes, RecordReq, RecordRes, LLMReq, LLMRes, Error
import jwt

models.Base.metadata.create_all(bind=engine)

app = FastAPI()

def getDB():
  db = database.SessionLocal()
  try:
    yield db
  finally:
    db.close()

# ユーザー情報登録
# TODO 書き直す
@app.post('/api/v1/user', response_model=UserRes, responses={400: {'model': Error}})
def postUser(request: UserReq, token: str = Depends(lambda: '')):
  # とりあえずのロジック
  user_id = '12345'
  users[user_id] = {
    'user_name': request.user_name,
    'children_names': request.children_names
  }
  return {'message': '登録に成功しました', 'user_id': user_id}

# ユーザー情報編集
# TODO 書き直す
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
# TODO 書き直す
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
# 書き直し済　TODO 動作確認
@app.get('/api/v1/main', responses={200: {'model': Dict[str, Any]}, 400: {'model': Error}})
def getMainData(child_name: str, year: str, month: str,db: Session = Depends(getDB)):
  records = crud.getRecordsByMonth(db, child_name, year, month)
  if not records:
    raise HTTPException(status_code=404, detail='記録が見つかりません')
  return records



# 記録の追加
# 書き直し済　TODO 動作確認
@app.post("/time-share-records/", response_model=models.TimeShareRecord)
def create_time_share_record(record: models.TimeShareRecord, db: Session = Depends(getDB)):
    dbRecord = crud.createRecords(
        db = db,
        user_id = record.user_id,
        with_member = record.with_member,
        child_name = record.child_name,
        events = record.events,
        child_condition = record.child_condition,
        place = record.place,
        share_start_at = record.share_start_at,
        share_end_at = record.share_end_at
    )
    if not dbRecord:
        raise HTTPException(status_code=400, detail="Failed to create record")
    return dbRecord

# TODO 子どもの名前だけ取得するメソッドを書く

# LLM分析
# TODO メソッド書き直し
@app.post('/api/v1/analysis', response_model=LLMRes, responses={400: {'model': Error}})
def getLlmAnalysis(request: LLMReq, token: str = Depends(lambda: '')):
  # TODO LLM分析機能の実装
  return {'summary': 'LLMによる要約', 'sentiment': 'ポジティブ'}
