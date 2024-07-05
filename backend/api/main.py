from fastapi import FastAPI, HTTPException, Request, Depends, Response
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
async def read_root():
  return {"message": "Welcome to the FastAPI application"}

@app.get("/protected-route")
async def protected_route(request: Request):
  user = request.state.user
  return {"message": f"Hello, {user['name']}"}

