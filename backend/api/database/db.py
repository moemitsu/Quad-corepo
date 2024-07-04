from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.ext.declarative import declarative_base

# データベースの接続情報を設定
DATABASE_URL = "postgresql://postgres:password@db:5432/sectionfdb"

# データベースエンジンを作成
engine = create_engine(DATABASE_URL)

# セッションファクトリを作成
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# モデルを定義するための基本となるBaseクラスを作成
Base = declarative_base()

# セッションを依存性として定義
def get_db():
  db = SessionLocal()
  try:
    yield db
  finally:
    db.close()