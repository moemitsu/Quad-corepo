from fastapi import FastAPI, HTTPException, Depends, Path, Query, Body
from fastapi.middleware.cors import CORSMiddleware
from typing import Optional, List, Dict, Any
from sqlalchemy.orm import Session
import openai 
from api.lib.auth import get_current_user
from api.routers import routers
from api.database.db import SessionLocal, engine
import api.schemas.schemas as schemas, api.cruds.timeShareRecords as crud, api.database as database


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