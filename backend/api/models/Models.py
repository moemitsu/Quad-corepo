from sqlalchemy import String, Column, Integer
from sqlalchemy.ext.declarative import declarative_base
from database import Base
from uuid import uuid4

# データモデルの作成
# sqlalchemyによってデータベースのテーブルが生成

class User(Base):
  __tablename__ = 'user'
  user_id = Column(Integer, primary_key=True, autoincrement= True)  # intで連番で採番される
  user_name = Column(String)
