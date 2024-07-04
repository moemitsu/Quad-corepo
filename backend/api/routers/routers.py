from fastapi import FastAPI, HTTPException, Depends, Query
from typing import Optional, Dict, Any
from sqlalchemy.orm import Session
from database import SessionLocal, engine
import backend.api.database.models as models, backend.api.schemas.schemas as schemas, backend.api.cruds as crud , backend.api.database as database
import openai
from openai import OpenAI
import os
import json

models.Base.metadata.create_all(bind=engine)

app = FastAPI()

openai.api_key=os.environ('OPENAI_API_KEY')

def getDB():
  db = database.SessionLocal()
  try:
    yield db
  finally:
    db.close()

# OpenAIを呼び出す関数
def analyzeOpenai(text: str):
  res = openai.Completion.create(
    model='text-davinci-003',
    prompt=text,
    max_tokens=2000,
    n=1,
    stop=None,
    temperature=0.5
  )
  return res.choices[0].text.strip()

# LLM分析の@app.post内でデータをフォーマットする関数
def formatRecords(records):
  formattedRecords = [record.__dict__ for record in records]
  for record in formattedRecords:
    record.pop('_sa_instance_state', None)
  return json.dumps(formattedRecords, indent=2)


# 以下メソッド
# ユーザー情報登録
# 書き直し済　TODO 要動作確認
@app.post('/api/v1/user', response_model=schemas.UserRes, responses={400: {'model': schemas.Error}})
def postUser(request: schemas.UserReq, db: Session = Depends(getDB)):
  dbUser = crud.createUser(db=db, user=request)
  return schemas.UserRes(message='登録完了！', user_id=dbUser.id)


# ユーザー情報編集
# TODO 書き直す　優先順位⓶
@app.put('/api/v1/user/{user_id}', response_model=schemas.UserReq, responses={400: {'model': schemas.Error}})
def updateUser(user_id: str, request: schemas.UserReq, token: str = Depends(getDB)):
  # とりあえずのロジック
  if user_id in users:
    users[user_id].update({
      'user_name': request.user_name,
      'children_names': request.children_names
    })
    return {'message': '情報を更新しました。', 'user_id': user_id}
  else:
    raise HTTPException(status_code=400, detail='ユーザーが見つかりません。')

# 子どもの追加　ユーザー情報の編集に入れられるのでは？？
# TODO 書き直す　優先順位⓶
@app.post('/api/v1/user/{user_id}/children', response_model=schemas.PostChildRes, responses={400: {'model': schemas.Error}})
def addChild(user_id: str, request: schemas.PostChildReq, token: str = Depends(lambda: '')):
  # とりあえずのロジック
  child_id = '54321'
  children[child_id] = {
    'child_name': request.child_name,
    'user_id': user_id
  }
  return {'child_id': child_id}

# 各月画面の情報を取得
# 書き直し済　TODO 要動作確認
@app.get('/api/v1/main', responses={200: {'model': Dict[str, Any]}, 400: {'model': schemas.Error}})
def getMainData(child_name: str, year: str, month: str,db: Session = Depends(getDB)):
  records = crud.getRecordsByMonth(db, child_name, year, month)
  if not records:
    raise HTTPException(status_code=404, detail='記録が見つかりません')
  return records

# 記録の追加
# 書き直し済　TODO 要動作確認
@app.post("/time-share-records/", response_model=models.TimeShareRecords)
def CreateRecords(record: models.TimeShareRecords, db: Session = Depends(getDB)):
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
        raise HTTPException(status_code=400, detail="記録の作成に失敗しました。")
    return dbRecord


# LLM分析
# メソッド書き直し済 TODO 要動作確認
@app.post('/api/v1/analysis', response_model=schemas.LLMRes, responses={400: {'model': schemas.Error}})
def getAnalysis(request: schemas.LLMReq, db: Session = Depends(getDB)):
  records = crud.getRecordsAnalysis(db, request.user_id, request.child_name)
  if not records:
    raise HTTPException(status_code=404, detail='記録が見つかりません')
  # 取得したデータをテキストに変換
  formattedRecords = formatRecords(records)
  #OpenAI API を使用して分析
  analysisResult = analyzeOpenai(formattedRecords)
  return schemas.LLMRes(summary=analysisResult, sentiment='N/A')
