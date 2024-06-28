from fastapi import FastAPI # FastAPIをインポート 
# FastAPIをインスタンス化する
app = FastAPI()
# getメソッドデータを取得
@app.get("/")
async def index():
    return {"message": "Hello World"}

@app.get("/items/{item_id}")
def read_item(item_id: int, q: str = None):
    return {"item_id": item_id, "q": q}