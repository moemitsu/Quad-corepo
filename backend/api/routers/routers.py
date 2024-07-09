from logging import config, getLogger
from fastapi import FastAPI, HTTPException, Depends, Query, Body, APIRouter
from typing import Optional, List, Dict, Any
from sqlalchemy.orm import Session
from api.database.db import SessionLocal, engine
import openai
import os
import json
import api.database.models as models
import api.schemas.schemas as schemas
# from ..database import get_db  #追加
import api.cruds.timeShareRecords as timeShareRecordsCrud
import api.cruds.payments as paymentsCrud
import api.cruds.stakeholder as stakeholderCrud
import api.cruds.user as userCrud
from api.lib.auth import verify_token, get_current_user
from api.services.stripe import router as stripe_router

models.Base.metadata.create_all(bind=engine)

# Initialize the logger
logger = getLogger(__name__)

app = FastAPI()
router = APIRouter()

openai.api_key = os.environ.get('OPENAI_API_KEY')

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# OpenAIを呼び出す関数
def analyze_openai(text: str):
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
def format_records(records):
    formatted_records = [record.__dict__ for record in records]
    for record in formatted_records:
        record.pop('_sa_instance_state', None)
    return json.dumps(formatted_records, indent=2)

# 以下メソッド
# メモ：記録を追加する（POST）、登録情報の編集（PUT）、LLMに情報渡して値貰う(POST)

# 新規登録（index⓹）トークン認証込みで書き直し済み　TODO 要動作確認
@router.post('/api/v1/signup', response_model=schemas.SignUpRes, responses={400: {'model': schemas.Error}})
def signup(token: str = Depends(verify_token), db: Session = Depends(get_db)):
    firebase_id = token['uid']
    stakeholder = stakeholderCrud.get_firebase_id(db, firebase_id)
    if stakeholder:
        raise HTTPException(status_code=400, detail="ユーザーは既に存在します")
    try:
        created_stakeholder = stakeholderCrud.create_new_stakeholder(db, firebase_id)
        return schemas.SignUpRes(message="新しいユーザーを作成しました", stakeholder_id=created_stakeholder.id)
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
        return schemas.UserRes(message='ユーザー情報を登録しました', user_id=new_user.id)
    except Exception as e:
        raise HTTPException(status_code=500, detail='ユーザー情報の登録に失敗しました：{}'.format(str(e)))

# ユーザー情報編集（情報編集画面⓸） TODO トークン認証込みで書き直し
@router.put('/api/v1/user/{user_id}', response_model=schemas.UserRes, responses={400: {'model': schemas.Error}})
def update_user(user_id: int, request: schemas.UserReq, token: str = Depends(verify_token), db: Session = Depends(get_db)):
    db_user = userCrud.update_user(db=db, user_id=request.user_id, adult_name=request.adult_name, child_name=request.child_name)
    if db_user:
        return schemas.UserRes(message='情報を更新しました', user_id=db_user.id)
    else:
        raise HTTPException(status_code=400, detail='ユーザーが見つかりません')

# adult_nameとchild_nameの取得（記録画面⓶）
@router.get('/api/v1/user', response_model=schemas.NamesRes, responses={400: {'model': schemas.Error}})
def get_names(token: str = Depends(verify_token), db: Session = Depends(get_db)):
    firebase_id = token['uid']
    stakeholder = stakeholderCrud.get_firebase_id(db, firebase_id)
    if not stakeholder:
        raise HTTPException(status_code=400, detail='ユーザーが見つかりません')
    names = userCrud.get_names(db, stakeholder.id)
    return schemas.NamesRes(names=names)

# 記録追加（記録画面⓶）
@router.post('/api/v1/record', response_model=schemas.RecordRes, responses={400: {'model': schemas.Error}})
def create_record(request: schemas.RecordReq, token: str = Depends(verify_token), db: Session = Depends(get_db)):
    firebase_id = token['uid']
    stakeholder = stakeholderCrud.get_firebase_id(db, firebase_id)
    if not stakeholder:
        raise HTTPException(status_code=400, detail='ユーザーが見つかりません')
    record = timeShareRecordsCrud.create_record(
        db=db,
        stakeholder_id=stakeholder.id,
        with_member=request.with_member,
        child_name=request.child_name,
        events=request.events,
        child_condition=request.child_condition,
        place=request.place,
        share_start_at=request.share_start_at,
        share_end_at=request.share_end_at
    )
    return schemas.RecordRes(message='記録を追加しました', record_id=record.id)

# LLMに情報を渡して値を取得（解析画面⓺）
@router.post('/api/v1/analysis', response_model=schemas.LLMRes, responses={400: {'model': schemas.Error}})
def get_analysis(request: schemas.LLMReq, db: Session = Depends(get_db)):
    records = timeShareRecordsCrud.get_records(
        db=db,
        stakeholder_id=request.stakeholder_id,
        child_name=request.child_name,
        year=request.year,
        month=request.month
    )
    formatted_records = format_records(records)
    openai_text = f"以下はある家族の記録です。\n{formatted_records}\nこれを基にその月の家族の活動についての要約を作成し、感情分析を行ってください。"
    analysis_result = analyze_openai(openai_text)
    return schemas.LLMRes(summary=analysis_result, sentiment="感情分析結果")

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

# 各月画面用の情報の取得　トークン認証込みで書き直し済み　TODO 動作確認
# 棒グラフ用GET
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

# LLM分析　 TODO トークン認証込みで書き直す
@router.post('/api/v1/analysis', response_model=schemas.LLMRes, responses={400: {'model': schemas.Error}})
def get_analysis(request: schemas.LLMReq, token: str = Depends(verify_token), db: Session = Depends(get_db)):
  records = timeShareRecordsCrud.get_records_analysis(db, request.user_id, request.child_name)
  if not records:
    raise HTTPException(status_code=404, detail='記録が見つかりません')
  # 取得したデータをテキストに変換
  formatted_records = format_records(records)
  #OpenAI API を使用して分析
  analysisResult = analyze_openai(formatted_records)
  return schemas.LLMRes(summary=analysisResult, sentiment='N/A')

# 確認用　FIXME あとで消す
@router.get("/api/v2/total-data", response_model=List[schemas.TimeShareRecordResponse])
def get_all_time_share_records(db: Session = Depends(get_db)):
  records = timeShareRecordsCrud.get_all_records(db)
  if not records:
    raise HTTPException(status_code=404, detail="記録が見つかりません")
  return records

# Stripe用のルーターを登録
router.include_router(stripe_router, prefix="/stripe", tags=["stripe"])

