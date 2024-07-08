import pytest
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from api.database.models import Base, User
from api.cruds.user import getStakeholder, getChild, createUser, updateUser

# テスト用のデータベースURI
SQLALCHEMY_DATABASE_URL = "sqlite:///./test.db"

# テスト用のデータベースエンジンとセッション
engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# テスト用のデータベースをセットアップ
Base.metadata.create_all(bind=engine)

@pytest.fixture(scope="function")
def db_session():
    """テスト用のデータベースセッションを提供するフィクスチャ"""
    connection = engine.connect()
    transaction = connection.begin()
    session = TestingSessionLocal(bind=connection)
    yield session
    session.close()
    transaction.rollback()
    connection.close()

def test_create_user(db_session):
    user = createUser(db_session, stakeholder_id=1, adult_name="Test Adult", child_name="Test Child")
    assert user.stakeholder_id == 1
    assert user.adult_name == "Test Adult"
    assert user.child_name == "Test Child"

def test_get_stakeholder(db_session):
    createUser(db_session, stakeholder_id=1, adult_name="Test Adult", child_name="Test Child")
    stakeholder = getStakeholder(db_session, adult_name="Test Adult")
    assert stakeholder is not None
    assert stakeholder().adult_name == "Test Adult"

def test_get_child(db_session):
    createUser(db_session, stakeholder_id=1, adult_name="Test Adult", child_name="Test Child")
    child = getChild(db_session, child_name="Test Child")
    assert child is not None
    assert child().child_name == "Test Child"

def test_update_user(db_session):
    user = createUser(db_session, stakeholder_id=1, adult_name="Test Adult", child_name="Test Child")
    updated_user = updateUser(db_session, user.user_id, adult_name="Updated Adult", child_name="Updated Child")
    assert updated_user is not None
    assert updated_user.adult_name == "Updated Adult"
    assert updated_user.child_name == "Updated Child"

def test_update_user_not_found(db_session):
    updated_user = updateUser(db_session, user_id=999, adult_name="Updated Adult", child_name="Updated Child")
    assert updated_user is None
