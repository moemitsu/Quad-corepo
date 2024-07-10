from logging import config, getLogger
from fastapi import FastAPI, HTTPException, Depends, Query, Body, APIRouter
from typing import Optional, List, Dict, Any
from sqlalchemy.orm import Session
from api.database.db import SessionLocal, engine
from dotenv import load_dotenv
from openai import OpenAI
import openai
import os
import json
import api.database.models as models, api.schemas.schemas as schemas, api.cruds.timeShareRecords as timeShareRecordsCrud, api.cruds.payments as paymentsCrud, api.cruds.stakeholder as stakeholderCrud, api.cruds.user as userCrud
from api.lib.auth import verify_token, get_current_user

models.Base.metadata.create_all(bind=engine)

load_dotenv()

# Initialize the logger
logger = getLogger(__name__)

app = FastAPI()
router = APIRouter()

api_key = os.getenv('OPENAI_API_KEY')
if not api_key:
    raise ValueError("APIキーがセットされていません。")

client = openai.OpenAI(api_key=api_key)

def get_db():
  db = SessionLocal()
  try:
    yield db
  finally:
    db.close()

# 以下メソッド
# 新規登録（index⓹）トークン認証込みで書き直し済み　TODO 要動作確認
@router.post('/api/v1/signup', response_model=schemas.SignUpRes, responses={400: {'model': schemas.Error}})
def signup(token: str = Depends(verify_token), db: Session = Depends(get_db)):
  firebase_id = token['uid']
  stakeholder = stakeholderCrud.get_firebase_id(db, firebase_id)
  if stakeholder:
    raise HTTPException(status_code=400, detail="ユーザーは既に存在します")
  try:
    created_stakeholder = stakeholderCrud.create_new_stakeholder(db, firebase_id)
    return schemas.StakeholderRes(message="新しいユーザーを作成しました", stakeholder_id=created_stakeholder.id)
  except Exception as e:
    raise HTTPException(status_code=500, detail="ユーザーの作成に失敗しました: {}".format(str(e)))

# ログイン（index⓹）トークン認証込みで書き直し済み　TODO 要動作確認
@router.post('/api/v1/login', response_model=schemas.StakeholderRes, responses={400: {'model': schemas.Error}})
def login(token: str = Depends(verify_token), db: Session = Depends(get_db)):
  firebase_id = token['uid']
  stakeholder = stakeholderCrud.get_firebase_id(db, firebase_id)
  if stakeholder:
    return schemas.StakeholderRes(message="ログイン成功", stakeholder_id=stakeholder.id)
  else:
    # ユーザーが存在しない場合、新しいユーザーを作成するかエラーを返す
    stakeholder_name = "default_name"  # 必要に応じてフロントエンドから受け取るか、適切なデフォルト値を設定
    new_stakeholder = schemas.StakeHolderReq(stakeholder_name=stakeholder_name, firebase_id=firebase_id)
    try:
      created_stakeholder = stakeholderCrud.create_stakeholder(db, new_stakeholder)
      return schemas.StakeholderRes(message="新しいユーザーを作成しました", stakeholder_id=created_stakeholder.id)
    except Exception as e:
      raise HTTPException(status_code=500, detail="ユーザーの作成に失敗しました: {}".format(str(e)))

# ユーザー情報登録（登録画面⓷）トークン認証込みで書き直し済み TODO 要動作確認
@router.post('/api/v1/user', response_model=schemas.UserRes, responses={400: {'model': schemas.Error}})
def post_user(
  token: str = Depends(verify_token),
  stakeholder_name: str = Body(...),
  adult_name: str = Body(...),
  child_name: str = Body(...),
  db: Session = Depends(get_db)
):
  firebase_id = token['uid']
  stakeholder = stakeholderCrud.get_firebase_id(db, firebase_id)
  if not stakeholder:
    raise HTTPException(status_code=400, detail='ユーザーが見つかりません')
  # stakeholder_nameの更新
  try:
    updated_stakeholder_name = stakeholderCrud.update_stakeholder_name(db, stakeholder.id, stakeholder_name)
  except Exception as e:
    raise HTTPException(status_code=500, detail='家族名の更新に失敗しました：{}'.format(str(e)))
  # userテーブルのadult_name,child_nameの登録
  try:
    new_user = userCrud.create_user(db, stakeholder.id, adult_name, child_name)
    return schemas.UserRes(message='ユーザー情報を登録しました',user_id=new_user.id)
  except Exception as e:
    raise HTTPException(status_code=500, detail='ユーザー情報の登録に失敗しました：{}'.format(str(e)))

# ユーザー情報編集（情報編集画面⓸） TODO トークン認証込みで書き直し
@router.put('/api/v1/user/{user_id}', response_model=schemas.UserReq, responses={400: {'model': schemas.Error}})
def update_user(user_id: int, request: schemas.UserReq, token: str = Depends(verify_token), db: Session = Depends(get_db)):
  db_user = userCrud.update_user(db=db, user_id=request.user_id, adult_name=request.adult_name, child_name=request.child_name)
  if db_user:
    return schemas.UserRes(message='情報を更新しました', user_id=db_user.id)
  else:
    raise HTTPException(status_code=400, detail='ユーザーが見つかりません')


# adult_nameとchild_nameの取得（記録画面⓶）トークン認証込みで書き直し済み
# TODO　要動作確認　FIXME トークンの問題
@router.get('api/v1/names', responses={200: {'model': Dict[str, Any]}, 400: {'model': schemas.Error}})
def get_names(
  token: str = Depends(verify_token),
  db: Session = Depends(get_db)
):
  firebase_id = token['uid']
  stakeholder = stakeholderCrud.get_firebase_id(db, firebase_id)
  if not stakeholder:
    raise HTTPException(status_code=400, detail='ユーザーが見つかりません')
  names = userCrud.get_adult_child_name(db, stakeholder.id)
  if not names:
    raise HTTPException(status_code=404, detail='名前が見つかりません')
  return {'名前': names}

# 記録の追加（記録画面⓶）トークン認証込みで書き直し済み　TODO 要動作確認
@router.post("/api/v1/time-share-records/", response_model=schemas.RecordRes)
def create_records(
  record: schemas.RecordReq,
  token: str = Depends(verify_token),
  db: Session = Depends(get_db)
):
  firebase_id = token['uid']
  stakeholder = stakeholderCrud.get_firebase_id(db, firebase_id)
  if not stakeholder:
    raise HTTPException(status_code=400, detail='ユーザーが見つかりません')
  new_record = timeShareRecordsCrud.create_records(
    db = db,
    stakeholder_id = stakeholder.id,
    with_member = record.with_member,
    child_name = record.child_name,
    events = record.events,
    child_condition = record.child_condition,
    place = record.place,
    share_start_at = record.share_start_at,
    share_end_at = record.share_end_at
  )
  return schemas.RecordRes(message='記録を追加しました', record_id=new_record.id)

# 各月画面用の情報の取得　トークン認証込みで書き直し済み　TODO 動作確認
# 棒グラフ用GET FIXME recordsが取得できていない
@router.get('/api/v1/bar-graph', responses={200: {'model': Dict[str, Any]}, 400: {'model': schemas.Error}})
def get_bar_data(
  token: str = Depends(verify_token),
  child_name: str = Query(...),
  year: int = Query(...),
  month: int = Query(...),
  db: Session = Depends(get_db)
):
  firebase_id = token['uid']
  stakeholder = stakeholderCrud.get_firebase_id(db, firebase_id)
  if not stakeholder:
    raise HTTPException(status_code=400, detail='ユーザーが見つかりません')
  records = timeShareRecordsCrud.get_bar_graph_by_month(db, stakeholder.id, child_name, year, month)
  if not records:
    raise HTTPException(status_code=400, detail='記録が見つかりません')

  result = {}
  for record in records:
    with_member = record[0]
    date = record[1]
    total_hours = record[2]
    if with_member not in result:
      result[with_member] = {}
    result[with_member][str(date)] = total_hours

    return result
  
# 円グラフ用GET　トークン認証込みで書き直し済み　TODO　動作チェック
@router.get('/api/v1/pie-graph', responses={200: {'model': Dict[str, Any]}, 400: {'model': schemas.Error}})
def get_pie_data(
  token: str = Depends(verify_token),
  child_name: str = Query(...),
  year: int = Query(...),
  month: int = Query(...),
  db: Session = Depends(get_db)
):
  firebase_id = token['uid']
  logger.info(f'Firebase ID: {firebase_id}')
  stakeholder = stakeholderCrud.get_firebase_id(db, firebase_id)
  logger.info(f'Stakeholder: {stakeholder}')
  if not stakeholder:
    logger.info('User not found')
    raise HTTPException(status_code=400, detail="ユーザーが見つかりません")
  share_time_percentages = timeShareRecordsCrud.get_pie_graph_by_month(db, stakeholder.id, child_name, year, month)
  if not share_time_percentages:
    logger.info('Records not found')
    raise HTTPException(status_code=404, detail='記録が見つかりません')
  result = {record[0]: record[1] for record in share_time_percentages}
  logger.info(f'Result: {result}')
  return result

# LLM分析 TODO 書き直し
# LLM TEST
@router.get('api/v1/llm-test')
def analysis(child_name: str, year: int, month: int, db: Session = Depends(get_db)):
  records = timeShareRecordsCrud.get_all_data_for_analysis(db)
  # NOTE データを整形
  data = {
    'with_member': [],
    'child_name': [],
    'events': [],
    'child_condition': [],
    'place': [],
    'share_start_at': [],
    'share_end_at': []
  }
  for record in records:
    data['with_member'].append(record.with_member)
    data['child_name'].append(record.child_name)
    data['events'].append(record.events)
    data['child_condition'].append(record.child_condition)
    data['place'].append(record.place)
    data['share_start_at'].append(record.share_start_at)
    data['share_end_at'].append(record.share_end_at)
    # NOTE 分析結果の要約を作成
    summary = f"""
    子どもと関わる人たち: {data['with_member']}
    子どもの名前: {data['child_name']}
    イベント: {data['events']}
    子どもの機嫌: {data['child_condition']}
    場所: {data['place']}
    共有開始時刻: {data['share_start_at']}
    共有終了時刻: {data['share_end_at']}
    """
    # NOTE アドバイスを生成
    response = openai.Completion.create(
      engine='text-davinci-003',
      prompt=f"以下のデータをもとに、家族がより良い時間を過ごすためのアドバイスをください。\n\n{summary}\n\nアドバイス:",
      max_tokens=2000
    )
    advice = response.choices[0].text.strip()
    return schemas.AdviceResponse(advice=advice)


# 確認用　TODO あとで消す
@router.get("/api/v2/total-data", response_model=List[schemas.TimeShareRecordResponse])
def get_all_time_share_records(db: Session = Depends(get_db)):
  records = timeShareRecordsCrud.get_all_records(db)
  if not records:
    raise HTTPException(status_code=404, detail="記録が見つかりません")
  return records
