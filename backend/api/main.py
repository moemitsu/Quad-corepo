from fastapi import FastAPI, HTTPException, Depends, Path, Query, Body
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
from api.database.models import User, Payments, TimeShareRecords

import jwt  # pip install PyJWTしてね

from datetime import datetime, timedelta

# FastAPIをインスタンス化する
app = FastAPI()

# 初期のやつ
@app.get("/")
async def index():
  return {"message": "Hello World"}