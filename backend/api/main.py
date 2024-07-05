from fastapi import FastAPI, HTTPException, Depends, Path, Query, Body
from api.lib.auth import get_current_user
from fastapi.middleware.cors import CORSMiddleware

# FastAPIをインスタンス化する
app = FastAPI()

# CORS設定
origins = [
  "http://localhost:3000",
  "https://localhost:3000",
]
app.add_middleware(
  CORSMiddleware,
  allow_origins=origins,
  allow_credentials=True,
  allow_methods=["*"],
  allow_headers=["GET", "POST", "PUT","DELETE"],
  # allow_headers=["Authorization", "Content-Type"]

)

@app.get("/")
def read_root():
  return {"message": "Welcome to the FastAPI application"}

@app.get("/protected-route")
def protected_route(user = Depends(get_current_user)):
  return {"message": "This is a protected route", "userid": user.uid}

