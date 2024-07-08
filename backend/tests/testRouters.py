import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from api.database.db import Base, getDB
from api.routers import app
import os

# PostgreSQLの接続URL
SQLALCHEMY_DATABASE_URL = os.getenv("TEST_DATABASE_URL", "postgresql://postgres:password@localhost:5432/test_db")

engine = create_engine(SQLALCHEMY_DATABASE_URL)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# テスト用データベースを使用するためのフィクスチャ
@pytest.fixture(scope="module")
def client():
    def override_get_db():
        try:
            db = TestingSessionLocal()
            yield db
        finally:
            db.close()

    app.dependency_overrides[getDB] = override_get_db
    client = TestClient(app)
    yield client

    # テスト後にデータベースをクリア
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)

    # シーディングデータを再度挿入する
    import subprocess
    subprocess.run(["poetry", "run", "python", "-m", "api.database.seed"])

def test_login(client):
    response = client.post('/api/v1/login', json={"token": "mock_token"})
    assert response.status_code == 200
    assert response.json() == {"message": "ログイン成功", "stakeholder_id": 1}

def test_post_stakeholder(client):
    response = client.post('/api/v1/stakeholder', json={"stakeholder_name": "John Doe", "firebase_id": "mock_firebase_id"})
    assert response.status_code == 200
    assert response.json() == {"message": "登録完了", "stakeholder_id": 1}

def test_post_user(client):
    response = client.post('/api/v1/user', json={"stakeholder_id": 1, "adult_name": "John", "child_name": "Doe"})
    assert response.status_code == 200
    assert response.json() == {"message": "登録完了！", "user_id": 1}

def test_update_user(client):
    response = client.put('/api/v1/user/1', json={"user_id": 1, "adult_name": "John", "child_name": "Doe"})
    assert response.status_code == 200
    assert response.json() == {"message": "情報を更新しました", "user_id": 1}

def test_get_main_data(client):
    response = client.get('/api/v1/main', params={"child_name": "Doe", "year": "2023", "month": "7"})
    assert response.status_code == 200
    assert response.json() == []  # 適切なレスポンスをここに設定します

def test_create_records(client):
    response = client.post('/time-share-records/', json={
        "user_id": 1,
        "with_member": "Member",
        "child_name": "Doe",
        "events": "Event",
        "child_condition": "Good",
        "place": "Park",
        "share_start_at": "2023-07-01T00:00:00",
        "share_end_at": "2023-07-01T01:00:00"
    })
    assert response.status_code == 200
    assert response.json() == {}  # 適切なレスポンスをここに設定します

def test_get_analysis(client):
    response = client.post('/api/v1/analysis', json={"user_id": 1, "child_name": "Doe"})
    assert response.status_code == 200
    assert response.json() == {"summary": "Analysis result", "sentiment": "N/A"}
