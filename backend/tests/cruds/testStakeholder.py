# test_stakeholder.py
import pytest
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from api.database.models import Base, Stakeholder
from api.cruds import stakeholder
from testDb import get_test_db
from api.schemas.schemas import stakeholderReq

# テスト用のデータベース設定
SQLALCHEMY_DATABASE_URL = "postgresql://postgres:password@db:5432/sectionfdb"
engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# テスト用データベースをセットアップ
@pytest.fixture(scope="module")
def setup_database():
    Base.metadata.create_all(bind=engine)
    yield
    Base.metadata.drop_all(bind=engine)

# テスト用のDBセッションを作成
@pytest.fixture(scope="function")
def db_session(setup_database):
    session = TestingSessionLocal()
    yield session
    session.close()

def test_get_stakeholder_id(db_session):
    # テスト用データを追加
    new_stakeholder = Stakeholder(id=1, stakeholder_name="Test Stakeholder", firebase_id="test_firebase_id")
    db_session.add(new_stakeholder)
    db_session.commit()

    # 関数をテスト
    stakeholder_id = stakeholder.getStakeHolderId(db_session, 1)
    assert stakeholder_id is not None
    assert stakeholder_id.id == 1
    assert stakeholder_id.stakeholder_name == "Test Stakeholder"
    assert stakeholder_id.firebase_id == "test_firebase_id"

def test_create_stakeholder(db_session):
    # テスト用データ
    stakeholder_data = stakeholderReq(stakeholder_name="New Stakeholder", firebase_id="new_firebase_id")

    # 関数をテスト
    new_stakeholder = stakeholder.createStakeholder(db_session, stakeholder_data)
    assert new_stakeholder is not None
    assert new_stakeholder.stakeholder_name == "New Stakeholder"
    assert new_stakeholder.firebase_id == "new_firebase_id"

def test_get_firebase_id(db_session):
    # テスト用データを追加
    new_stakeholder = Stakeholder(id=2, stakeholder_name="Another Stakeholder", firebase_id="another_firebase_id")
    db_session.add(new_stakeholder)
    db_session.commit()

    # 関数をテスト
    firebase_id = stakeholder.getFirebaseId(db_session, "another_firebase_id")
    assert firebase_id is not None
    assert firebase_id.id == 2
    assert firebase_id.stakeholder_name == "Another Stakeholder"
    assert firebase_id.firebase_id == "another_firebase_id"
