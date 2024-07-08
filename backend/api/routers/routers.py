from fastapi import FastAPI, HTTPException, Depends, Query, APIRouter
from typing import Optional, List, Dict, Any
from sqlalchemy.orm import Session
from api.database.db import SessionLocal, engine
import openai
import os
import json
import api.database.models as models, api.schemas.schemas as schemas, api.cruds.timeShareRecords as timeShareRecordsCrud, api.cruds.payments as paymentsCrud, api.cruds.stakeholder as stakeholderCrud, api.cruds.user as userCrud
from api.lib.auth import verify_token, get_current_user


models.Base.metadata.create_all(bind=engine)

app = FastAPI()
router = APIRouter()

# openai.api_key=os.environ('OPENAI_API_KEY')

def getDB():
  db = SessionLocal()
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

# LLM分析の@router.post内でデータをjson形式へフォーマットする関数
def formatRecords(records):
  formattedRecords = [record.__dict__ for record in records]
  for record in formattedRecords:
    record.pop('_sa_instance_state', None)
  return json.dumps(formattedRecords, indent=2)

# メソッド
# ログイン 書き直し済み　TODO 用動作確認
@router.post('/api/v1/login', response_model=schemas.StakeholderRes, responses={400: {'model': schemas.Error}})
def login(token: str = Depends(verify_token), db: Session = Depends(getDB)):
    firebase_id = token['uid']
    stakeholder = stakeholderCrud.getFirebaseId(db, firebase_id)
    if stakeholder:
        return schemas.StakeholderRes(message="ログイン成功", stakeholder_id=stakeholder.id)
    else:
        # ユーザーが存在しない場合、新しいユーザーを作成するかエラーを返す
        stakeholder_name = "default_name"  # 必要に応じてフロントエンドから受け取るか、適切なデフォルト値を設定
        new_stakeholder = schemas.StakeHolderReq(stakeholder_name=stakeholder_name, firebase_id=firebase_id)
        try:
            created_stakeholder = stakeholderCrud.createStakeholder(db, new_stakeholder)
            return schemas.StakeholderRes(message="新しいユーザーを作成しました", stakeholder_id=created_stakeholder.id)
        except Exception as e:
            raise HTTPException(status_code=500, detail="ユーザーの作成に失敗しました: {}".format(str(e)))


# 新規登録　TODO 要動作確認
@router.post('/api/v1/stakeholder', response_model=schemas.StakeholderRes, responses={400: {'model': schemas.Error}})
def postStakeholder(request: schemas.StakeHolderReq, db: Session = Depends(getDB)):
  stakeholder = stakeholderCrud.createStakeholder(db, request)
  return schemas.StakeholderRes(message='登録完了', stakeholder_id=stakeholder.id)


# ユーザー情報登録　書き直し済　TODO 要動作確認
@router.post('/api/v1/user', response_model=schemas.UserRes, responses={400: {'model': schemas.Error}})
def postUser(request: schemas.UserReq, db: Session = Depends(getDB)):
  dbUser = userCrud.createUser(db=db, stakeholder_id=request.stakeholder_id, adult_name=request.adult_name, child_name=request.child_name)
  return schemas.UserRes(message='登録完了！', user_id=dbUser.id)

# ユーザー情報編集　書き直し済 TODO 要動作確認
@router.put('/api/v1/user/{user_id}', response_model=schemas.UserReq, responses={400: {'model': schemas.Error}})
def updateUser(user_id: int, request: schemas.UserReq, db: Session = Depends(getDB)):
  dbUser = userCrud.updateUser(db=db, user_id=request.user_id, adult_name=request.adult_name, child_name=request.child_name)
  if dbUser:
    return schemas.UserRes(message='情報を更新しました', user_id=dbUser.id)
  else:
    raise HTTPException(status_code=400, detail='ユーザーが見つかりません')

# 各月画面の情報を取得　書き直し済　TODO 要動作確認
@router.get('/api/v1/main', responses={200: {'model': Dict[str, Any]}, 400: {'model': schemas.Error}})
def getMainData(child_name: str, year: str, month: str,db: Session = Depends(getDB)):
  records = timeShareRecordsCrud.getRecordsByMonth(db, child_name, year, month)
  if not records:
    raise HTTPException(status_code=404, detail='記録が見つかりません')
  return records

# 記録の追加　書き直し済　TODO 要動作確認
@router.post("/api/v1/time-share-records/", response_model=schemas.RecordRes)
def CreateRecords(record: schemas.RecordReq, db: Session = Depends(getDB)):
    dbRecord = timeShareRecordsCrud.createRecords(
      db = db,
      stakeholder_id = record.stakeholder_id,
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


# LLM分析　メソッド書き直し済 TODO 要動作確認
@router.post('/api/v1/analysis', response_model=schemas.LLMRes, responses={400: {'model': schemas.Error}})
def getAnalysis(request: schemas.LLMReq, db: Session = Depends(getDB)):
  records = timeShareRecordsCrud.getRecordsAnalysis(db, request.user_id, request.child_name)
  if not records:
    raise HTTPException(status_code=404, detail='記録が見つかりません')
  # 取得したデータをテキストに変換
  formattedRecords = formatRecords(records)
  #OpenAI API を使用して分析
  analysisResult = analyzeOpenai(formattedRecords)
  return schemas.LLMRes(summary=analysisResult, sentiment='N/A')

# メモ：ログイン（GET）　新規登録（POST）　各月画面（GET）　記録を追加するときの利用者・子供選択（GET）　記録を追加する（POST）　登録情報の編集　（PUT）

@router.get("/api/v2/total-data", response_model=List[schemas.TimeShareRecordResponse])
def get_all_time_share_records(db: Session = Depends(getDB)):
  records = timeShareRecordsCrud.getAllRecords(db)
  if not records:
    raise HTTPException(status_code=404, detail="記録が見つかりません")
  return records