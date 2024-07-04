from fastapi import FastAPI, HTTPException, Depends, Path, Query, Body
from pydantic import BaseModel
from typing import List, Optional, Dict, Any

from datetime import datetime, timedelta

from fastapi.middleware.cors import CORSMiddleware


# FastAPIをインスタンス化する
app = FastAPI()

origins = [
    "http://localhost/",
    "http://localhost:3000/",  # Next.jsのデフォルトポート
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT","DELETE"],
    allow_headers=["*"],
)

# 初期のやつ
@app.get("/")
async def index():
  return {"message": "Hello World"}