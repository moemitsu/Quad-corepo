# test_payments.py
import pytest
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from api.database.models import Base, Payments
from api.cruds import payments


# テスト用のデータベース設定
# シーディングデータをテストに利用する
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

def test_get_payments_id(db_session):
    # テスト用データを追加
    new_payment = Payments(id=1, amount=1000, description="Test payment")
    db_session.add(new_payment)
    db_session.commit()
    
    # 関数をテスト
    payment = payments.getPaymentsId(db_session, 1)
    assert payment is not None
    assert payment.id == 1
    assert payment.amount == 1000
    assert payment.description == "Test payment"
