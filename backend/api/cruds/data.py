from fastapi import FastAPI, HTTPException, Depends, Path, Query, Body
from pydantic import BaseModel
from typing import List, Optional, Dict, Any

import jwt  # pip install PyJWTしてね

from datetime import datetime, timedelta

# ベタ打ちデータ
users = {
  "12345": {
    "email": "test@test.com",
    "user_name": ["User A", "User B"],
    "children_names": ["Child One", "Child Two"]
  }
}

children = {
  "54321": {
    "child_name": "Child One",
    "user_id": "12345"
  }
}

records = [
  {
    "record_id": "67890",
    "user_id": "12345",
    "child_name": "Child One",
    "activity": "Reading",
    "start_time": "2024-06-01T10:00:00",
    "end_time": "2024-06-01T11:00:00"
  }
]