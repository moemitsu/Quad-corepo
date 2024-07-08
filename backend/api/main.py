import logging
import logging.config
import yaml
from fastapi import FastAPI, HTTPException, Request, Depends, Response
from fastapi.middleware.cors import CORSMiddleware
from typing import Optional, List, Dict, Any
from sqlalchemy.orm import Session
from api.lib.auth import get_current_user
from api.routers import routers
from api.database.db import SessionLocal, engine
import api.schemas.schemas as schemas, api.cruds.timeShareRecords as crud, api.database as database

# YAMLファイルを読み込み、ログ設定を適用
with open("logging.yaml", "r") as file:
    config = yaml.safe_load(file)
    logging.config.dictConfig(config)

logger = logging.getLogger(__name__)


# FastAPIをインスタンス化する
app = FastAPI()
app.include_router(routers.router)

def getDB():
  db = SessionLocal()
  try:
    yield db
  finally:
    db.close()

# CORS設定
origins = [
  "http://localhost:3000",
  "https://localhost:3000"
]
app.add_middleware(
  CORSMiddleware,
  allow_origins=origins,
  allow_credentials=True,
  allow_methods=["*"],
  allow_headers=["GET", "POST", "PUT","DELETE"]
  # allow_headers=["Authorization", "Content-Type"]
)


@app.get("/")
async def read_root():
  logger.info("Root endpoint called")
  return {"message": "Welcome to the FastAPI application"}

@app.get("/protected-route")
async def protected_route(request: Request):
  user = request.state.user
  return {"message": f"Hello, {user['name']}"}

@app.get("/api/v1/total-data", response_model=List[schemas.TimeShareRecordResponse])
def get_all_time_share_records(db: Session = Depends(getDB)):
    records = crud.getAllRecords(db)
    if not records:
        raise HTTPException(status_code=404, detail="記録が見つかりません")
    return records