from fastapi import FastAPI # FastAPIをインポート 
# FastAPIをインスタンス化する
app = FastAPI()
# getメソッドデータを取得
@app.get("/")
async def index():
    return {"message": "Hello World"}
# ログイン
@app.post("/api/v1/auth/login")
def read_item(item_id: int, q: str = None):
    return {"item_id": item_id, "q": q}

# ユーザー情報登録
@app.post("/api/v1/user")

# ユーザー情報編集
@app.put("/api/v1/user/{user_id}")

# 子どもの追加
@app.post("/api/v1/user/{user_id}/children")

# 各月画面の情報を取得
@app.get("/api/v1/main")

# 記録の追加
@app.post("/api/v1/records")

# LLM分析
@app.post("/api/v1/analysis")
