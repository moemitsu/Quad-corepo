import pytest
import pytest_asyncio
from httpx import AsyncClient
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker
from sqlalchemy.sql import text
from api.database.db import get_db, Base
from api.lib.auth import verify_token
from api.database.models import Stakeholder, User
from api.main import app
import starlette.status
import subprocess
from unittest.mock import patch
import os
from dotenv import load_dotenv

load_dotenv()  # 環境変数を読み込む
ASYNC_DB_URL = "postgresql+asyncpg://postgres:password@db:5432/sectionfdb"


@pytest_asyncio.fixture
async def async_client() -> AsyncClient:
    # Async用のengineとsessionを作成
    async_engine = create_async_engine(ASYNC_DB_URL, echo=True)
    async_session = sessionmaker(
        autocommit=False, autoflush=False, bind=async_engine, class_=AsyncSession
    )

    # テスト用にオンメモリのpostgresテーブルを初期化（関数ごとにリセット）
    async with async_engine.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)
        print('--------------db clear')
        await conn.run_sync(Base.metadata.create_all)
        print('--------------db create')

    # シーディング処理
    try:
        subprocess.run(["poetry", "run", "python", "-m", "api.database.seed"], check=True)
        print('--------------seeding complete')
    except subprocess.CalledProcessError as e:
        print(f'Seeding failed: {e}')

    # DIを使ってFastAPIのDBの向き先をテスト用DBに変更
    async def get_test_db():
        async with async_session() as session:
            yield session

    async def mock_verify_token():
        # モックのトークンを設定
        Firebase1 = os.getenv('FIREBASE_UID1')
        print('------------------------------uid',f'{Firebase1}')
        return {'uid': f'{Firebase1}'}
    
    app.dependency_overrides[get_db] = get_test_db
    app.dependency_overrides[verify_token] = mock_verify_token

    # テスト用に非同期HTTPクライアントを返却
    async with AsyncClient(app=app, base_url="http://test") as client:
        yield client

# すでにstakeholderにuidが登録されている場合のテスト
@pytest.mark.asyncio
async def test_create_user_with_existing_stakeholder(async_client):
    print('------------------------------test_create_user_with_existing_stakeholder')
    Firebase1 = os.getenv('FIREBASE_UID1')
    # シーディングされたユーザーデータに一致するfirebase_idから確認用データ取得
    firebase_id = Firebase1
    async for session in app.dependency_overrides[get_db]():
        stakeholder_rusult = await session.execute(
            text('SELECT * FROM "Stakeholder" WHERE firebase_id = :firebase_id'),
            {'firebase_id': firebase_id}
        )
        stakeholder_row = stakeholder_rusult.fetchone()
        if stakeholder_row is None:
            pytest.fail(f"No stakeholder found with firebase_id: {firebase_id}")
        print('------------------------------get', stakeholder_row)
        # データベース行をStakeholderオブジェクトにマッピング
        stakeholder = Stakeholder(id=stakeholder_row[0], stakeholder_name=stakeholder_row[1], firebase_id=stakeholder_row[2])
        print('------------------------------get', stakeholder.id,stakeholder.stakeholder_name)

    headers = {
        'Authorization': 'Bearer test_token'
    }
    record_data = {
            'stakeholder_name':'新垣',
            'adult_names':['父', '祖母', '叔母'],
            'child_names':['ゆい', 'ゆあ', 'ゆみ'],
    }
    response = await async_client.post(
        "/api/v1/user",
        headers=headers,
        json=record_data
    )
    print('------------------------------response content', response.content)
    assert response.status_code == starlette.status.HTTP_200_OK
    response_obj = response.json()
    print(response_obj)
    assert response_obj['message'] == 'ユーザー情報を登録しました'
    assert 'user_id' in response_obj

# stakeholderが存在しない場合のテスト
@pytest.mark.asyncio
async def test_create_user_with_new_stakeholder(async_client):
    print('------------------------------test_create_user_with_new_stakeholder')
    Firebase3 = os.getenv('FIREBASE_UID3')
    
    async def mock_verify_token():
        print('------------------------------uid', f'{Firebase3}')
        return {'uid': f'{Firebase3}'}
    
    app.dependency_overrides[verify_token] = mock_verify_token
    
    headers = {
        'Authorization': 'Bearer test_token'
    }
    record_data = {
        'stakeholder_name': '新垣',
        'adult_names': ['父', '祖母', '叔母'],
        'child_names': ['ゆい', 'ゆあ', 'ゆみ'],
    }
    response = await async_client.post(
        "/api/v1/user",
        headers=headers,
        json=record_data
    )
    print('------------------------------response content', response.content)
    assert response.status_code == starlette.status.HTTP_200_OK
    response_obj = response.json()
    print(response_obj)
    assert response_obj['message'] == 'ユーザー情報を登録しました'
    assert 'user_id' in response_obj
