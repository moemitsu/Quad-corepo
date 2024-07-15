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

@pytest.mark.asyncio
async def test_family_records(async_client):
    print('------------------------------test_family_records')
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
        
        # Userテーブルからstakeholder_idの一致するuserデータを取得
        users_result = await session.execute(
            text('SELECT * FROM "User" WHERE stakeholder_id = :stakeholder_id'),
            {'stakeholder_id': stakeholder.id}
        )
        users_rows = users_result.fetchall()
        print('------------------------------get', users_rows)
        
        # タプルからUserオブジェクトのリストを作成
        users = [User(id=row[0], stakeholder_id=row[1], adult_name=row[2], child_name=row[3]) for row in users_rows]
        
        # adult_name と child_name のリストを作成
        adult_names = [user.adult_name for user in users if user.adult_name]
        child_names = [user.child_name for user in users if user.child_name]
        print('test_familyrecords94--------------------get', adult_names, child_names)

    headers = {
        'Authorization': 'Bearer test_token'
    }
    params = {
            'child_name':child_names[0],
            'year':2024,
            'month':7,
    }
    response = await async_client.get("/api/v1/family-records", headers=headers,params=params)
    print(response)
    assert response.status_code == starlette.status.HTTP_200_OK
    response_obj = response.json()
    print('test_familyrecords108------------------------------get',response_obj)
    assert 'with_member' in response_obj[0]
    assert 'events' in response_obj[0]
    assert 'child_condition' in response_obj[0]
    assert 'place' in response_obj[0]
    assert 'share_start_at' in response_obj[0]
    assert 'share_end_at' in response_obj[0]