from logging import config, getLogger
from fastapi import FastAPI, HTTPException, Depends, Query, Body, APIRouter
from typing import Optional, List, Dict, Any
from sqlalchemy.orm import Session
from api.database.db import SessionLocal, engine
from dotenv import load_dotenv
import openai
from openai.types import Completion, CompletionChoice, CompletionUsage
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
import logging
from fastapi.responses import JSONResponse
import pandas as pd

models.Base.metadata.create_all(bind=engine)
load_dotenv()

# Initialize the logger
logger = getLogger(__name__)

app = FastAPI()
router = APIRouter()

api_key = os.getenv('OPENAI_API_KEY')
print('api_key', api_key)
openai.api_key = api_key

logger = logging.getLogger(__name__)

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
        return schemas.SignUpRes(message="新しいユーザーを作成しました", stakeholder_id=created_stakeholder.id)
    except Exception as e:
        raise HTTPException(status_code=500, detail="ユーザーの作成に失敗しました: {}".format(str(e)))

# ログイン（index⓹）トークン認証込みで書き直し済み　TODO 要動作確認
# ログイン時は認証をフロントで行うので不要
# @router.post('/api/v1/login', response_model=schemas.StakeholderRes, responses={400: {'model': schemas.Error}})
# def login(token: str = Depends(verify_token), db: Session = Depends(get_db)):
#     firebase_id = token['uid']
#     stakeholder = stakeholderCrud.get_firebase_id(db, firebase_id)
#     if stakeholder:
#         return schemas.StakeholderRes(message="ログイン成功", stakeholder_id=stakeholder.id)
#     else:
#         # ユーザーが存在しない場合、新しいユーザーを作成するかエラーを返す
#         stakeholder_name = "default_name"  # 必要に応じてフロントエンドから受け取るか、適切なデフォルト値を設定
#         new_stakeholder = schemas.StakeHolderReq(stakeholder_name=stakeholder_name, firebase_id=firebase_id)
#         try:
#             created_stakeholder = stakeholderCrud.create_stakeholder(db, new_stakeholder)
#             return schemas.StakeholderRes(message="新しいユーザーを作成しました", stakeholder_id=created_stakeholder.id)
#         except Exception as e:
#             raise HTTPException(status_code=500, detail="ユーザーの作成に失敗しました: {}".format(str(e)))

# ユーザー情報登録（登録画面⓷）トークン認証込みで書き直し済み TODO 要動作確認
@router.post('/api/v1/user', response_model=schemas.UserRes, responses={400: {'model': schemas.Error}})
def post_user(
    token: str = Depends(verify_token),
    stakeholder_name: str = Body(...),
    adult_names: List[str] = Body(...),
    child_names: List[str] = Body(...),
    db: Session = Depends(get_db)
):
    firebase_id = token['uid']
    stakeholder = stakeholderCrud.get_firebase_id(db, firebase_id)
    
    # ユーザーが存在しない場合、新規作成
    if not stakeholder:
        try:
            stakeholder = stakeholderCrud.create_new_stakeholder(db, firebase_id)
            stakeholder = stakeholderCrud.get_firebase_id(db, firebase_id)
        except Exception as e:
            raise HTTPException(status_code=500, detail='新しいユーザーの作成に失敗しました: {}'.format(str(e)))
    
    # stakeholder_nameの更新
    try:
        updated_stakeholder_name = stakeholderCrud.update_stakeholder_name(db, stakeholder.id, stakeholder_name)
    except Exception as e:
        raise HTTPException(status_code=500, detail='家族名の更新に失敗しました：{}'.format(str(e)))

    # userテーブルのadult_names, child_namesの登録
    try:
        user_ids = []
        for adult_name in adult_names:
            new_adult_user = userCrud.create_user(db, stakeholder.id, adult_name=adult_name, child_name=None)
            user_ids.append(new_adult_user.id)
        for child_name in child_names:
            new_child_user = userCrud.create_user(db, stakeholder.id, adult_name=None, child_name=child_name)
            user_ids.append(new_child_user.id)
        return schemas.UserRes(message='ユーザー情報を登録しました', user_id=user_ids)
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
    return schemas.NamesRes(adult_names=names['adult_names'], child_names=names['child_names'])

# 記録追加（記録画面⓶）
@router.post('/api/v1/record', response_model=schemas.RecordRes, responses={400: {'model': schemas.Error}})
def create_record(
        request: schemas.RecordReq,
        token: str = Depends(verify_token),
        db: Session = Depends(get_db)
    ):
        logger.info('------------------create record1')
        firebase_id = token['uid']
        stakeholder = stakeholderCrud.get_firebase_id(db, firebase_id)
        if not stakeholder:
            logger.error("Stakeholder not found")
            raise HTTPException(status_code=400, detail='ユーザーが見つかりません')
        try:
            record = timeShareRecordsCrud.create_record(
                db=db,
                stakeholder_id=request.stakeholder_id,
                with_member=request.with_member,
                child_name=request.child_name,
                events=request.events,
                child_condition=request.child_condition,
                place=request.place,
                share_start_at=request.share_start_at,
                share_end_at=request.share_end_at
        )
            return schemas.RecordRes(message='記録を追加しました', record_id=record.id)
        except Exception as e:
            logger.error(f"Error creating record: {e}")
        return JSONResponse(status_code=400, content={"detail": "記録の作成中にエラーが発生しました"})

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

# 家族データ一覧の取得
@router.get("/api/v1/family-records", response_model=List[schemas.DetailListRes])
def get_each_detail_lists(
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
  records = timeShareRecordsCrud.get_each_detail_lists_by_month(db, stakeholder.id, child_name, year, month)
  if not records:
    raise HTTPException(status_code=404, detail="記録が見つかりません")
  return records


# LLM分析 TODO 書き直し
# LLM TEST
@router.get('/api/v1/llm-test', response_model=schemas.Completion)
def analysis(child_name: str = Query(...), year: int = Query(...), month: int = Query(...), db: Session = Depends(get_db)):
    logger.info("llm-test endpoint called")
    print('キー',api_key)
    # データベースからデータを取得
    records = timeShareRecordsCrud.get_records_by_month(db, child_name, year, month)
    print(f'データ:', records)
    logger.debug(f"Records fetched: {records}")
    if not records:
        raise HTTPException(status_code=404, detail='記録が見つかりません。')
    # データの整理
    data = []
    for record in records:
        data.append({
            "with_member": record.with_member,
            "child_name": record.child_name,
            "events": record.events,
            "child_condition": record.child_condition,
            "place": record.place,
            "share_start_at": record.share_start_at,
            "share_end_at": record.share_end_at
        })

        df = pd.DataFrame(data)

        df['share_start_at'] = pd.to_datetime(df['share_start_at'])
        df['share_end_at'] = pd.to_datetime(df['share_end_at'])
        # share_end_atとshare_start_atの差分を計算し、分単位に変換
        df['interaction_time'] = (df['share_end_at'] - df['share_start_at']).dt.total_seconds() / 60
        
        # 時間の集計
        try:
            time_summary = df.groupby('with_member')['interaction_time'].sum().reset_index()
        except KeyError as e:
            raise HTTPException(status_code=500, detail=f'KeyError in time_summary:{str(e)}')
        # 行先と子供の機嫌の関連性分析
        try:
            condition_analysis = df.groupby(['place', 'child_condition']).size().reset_index(name='count')
        except KeyError as e:
            raise HTTPException(status_code=500, detail=f'KeyError in condition_analysis:{str(e)}')
        # 時間パターンの分析
        try:
            time_pattern = df.groupby(['with_member', 'place', 'events']).agg({'interaction_time': 'sum'}).reset_index()
        except KeyError as e:
            raise HTTPException(status_code=500, detail=f'KeyError in time_pattern:{str(e)}')

        summary = f"""
        家族の触れ合い時間の総計：
        {time_summary}

        行き先と子供の機嫌の関連性：
        {condition_analysis}

        時間パターン分析：
        {time_pattern}
        """
        print('time_summary', time_summary)
        print('condition_analysis', condition_analysis)
        print('time_pattern', time_pattern)
        try:
            response = Completion(
                engine="text-davinci-003",
                prompt=f"あなたは優秀な分析家であり親切なアドバイザーです。以下のデータを分析し、家族がより良い時間を過ごすためのアドバイスをください。返答は日本語で行ってください。\n\n{summary}\n\nアドバイス:",
                max_tokens=2000,
                n=1,
                temperature=0.4
            )
            completion_response = schemas.Completion(**response)
        except Exception as e:
            raise HTTPException(status_code=500, detail=f'OpenAI API Error:{str(e)}')
        print(completion_response)
        return completion_response

# completion = client.chat.completions.create(
#     model='gpt-3.5-turbo',
#     messages=[
#         {"role": "system", "content": "あなたは優秀な数学者です。"},
#         {"role": "user", "content": "1+1は？"}
#     ]
# )
# print(completion.choices[0].message)


# 確認用　TODO あとで消す
@router.get("/api/v2/total-data", response_model=List[schemas.TimeShareRecordResponse])
def get_all_time_share_records(db: Session = Depends(get_db)):
    records = timeShareRecordsCrud.get_all_records(db)
    if not records:
        raise HTTPException(status_code=404, detail="記録が見つかりません")
    return records