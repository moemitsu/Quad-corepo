import pytest
import pytest_asyncio
from httpx import AsyncClient
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker
from api.database.db import get_db, Base
from api.main import app
import starlette.status
import subprocess 
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

    app.dependency_overrides[get_db] = get_test_db

    # テスト用に非同期HTTPクライアントを返却
    async with AsyncClient(app=app, base_url="http://test") as client:
        yield client

@pytest.mark.asyncio
async def test_hello_world(async_client):
    response = await async_client.get("/")
    assert response.status_code == starlette.status.HTTP_200_OK

@pytest.mark.asyncio
async def test_get_all_time_share_records(async_client):
    response = await async_client.get("/api/v1/total-data")
    print(response.status_code)
    print(response.text)
    assert response.status_code == starlette.status.HTTP_200_OK
    response_obj = response.json()
    print(response_obj)
    assert len(response_obj) >= 1