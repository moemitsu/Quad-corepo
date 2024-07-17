from logging import config, getLogger
import yaml
from fastapi import FastAPI, HTTPException, Depends, Request
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from api.database.db import SessionLocal
from typing import List
import api.schemas.schemas as schemas, api.cruds.timeShareRecords as crud, api.database as database
from api.routers.routers import router as app_router
from api.routers.stripe import router as stripe_router

# schemas.py からインポート
from api.schemas.schemas import RecordReq, RecordRes, Error

# log出力に関するrootでの設定
logger = getLogger(__name__)
def main():
    """エントリーポイント
    """
    logger.debug(f"DEBUG")
    logger.info(f"INFO")
    logger.warning(f"WARNING")
    logger.error(f"ERROR")

if __name__ == "__main__":
    try:
        # ロガーの設定読み込み
        config.dictConfig(
            yaml.load(open("./logging.yaml", encoding="utf-8").read(), Loader=yaml.SafeLoader))
        # メイン処理開始
        main()
    except KeyboardInterrupt:
        # [Ctrl-C]が押されたときの終了捕捉
        print("SIGINT - Exit")
    except SystemExit:
        # sys.exit関数による終了捕捉
        print("SystemExit - Exit")
    except:
        # 例外発生時にメッセージ
        import traceback
        traceback.print_exc()
    finally:
        pass

# FastAPIをインスタンス化する
app = FastAPI()

def get_db():
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
    allow_origins=["*"],  # または特定のドメインをリストに追加
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
# ルーターの登録
app.include_router(app_router)
app.include_router(stripe_router, prefix="/stripe", tags=["stripe"])

@app.get("/")
async def read_root():
    logger.info("Root endpoint called")
    print("------------------Root endpoint called")
    return {"message": "Welcome to the FastAPI application"}

# @app.get("/protected-route")
# async def protected_route(request: Request):
#   user = request.state.user
#   return {"message": f"Hello, {user['name']}"}