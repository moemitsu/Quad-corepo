import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from api.database.db import Base, getDB
from api.routers import app

# PostgreSQLの接続URL
SQLALCHEMY_DATABASE_URL = "postgresql://user:password@localhost:5432/test_db"

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