# corepo API仕様書

| 機能         | メソッド | パス          | 説明                       |
|--------------|---------|--------------|----------------------------|
| ログイン | POST | `/api/v1/auth/login` | ログイン認証用 |
| ユーザー情報登録 | POST | `/api/v1/user` | 認証後にユーザー情報を登録 |
| ユーザー情報編集 | PUT | `/api/v1/user/{user_id}` | ユーザー情報の更新 |
| 子どもの追加 | POST | `/api/v1/user/{user_id}/children` | 子どもを追加する |
| 各月画面の情報を取得 | GET | `/api/v1/main` | 各月画面に表示されるすべてのデータを取得 |
| 記録の追加 | POST | `/api/v1/records` | 子どもとの時間の記録を登録 |
| LLM分析 | POST | `/api/v1/analysis` | LLMにテキストを送信して分析結果を取得する |


<!--第2段階で実装
| 新規登録 | POST | `/api/v1/auth/register` | ユーザーの新規登録 |
| 記録の更新 | PUT | `/api/v1/records/{record_id}` | 特定の記録の更新 |
-->

# ユーザー認証関連エンドポイント
## ログイン [POST /auth/login]
ユーザーがログインするためのエンドポイント
+ Request
  + Body
    ```
    {
      "email": "test@test.com",
      "password": "password"
    }
    ```
+ Response 200 OK
  + Body
    ```
    {
      "token": "jwt_token"
    }
    ```
  + Response 401
  + Body
  ```
  {
    "error": "メールアドレスかパスワードが間違っています。"
  }
  ```
<!-- 第2段階で実装
## 新規登録 [POST /auth/register]
新しいユーザーを登録するためのエンドポイント
+ Request
  + Body
    ```
    {
      "email": "test@test.com",
      "password": "password",
      "name": "User Name"
    }
    ```
+ Response 200 OK
  + Body
    ```
    {
      "message": "新規登録が完了しました。"
    }
    ``` -->

# ユーザー情報管理エンドポイント
## ユーザー登録 [POST /api/v1/user]
認証後にユーザーの情報を登録するためのエンドポイント
+ Request
  + Body
  ```
  {
    "email": "test@test.com",
    "password": "password",
    "user_name": ["User A", "User B"],
    "children_names": ["Child One", "Child Two"]
  }
  ```
+ Response 201 Created
  + Body
  ```
  {
    "message": "User registered successfully",
    "user_id": "12345"
  }
  ```
+ Response 400 Bad Request
  + Body
  ```
  {
    "error": "不正なリクエストです。"
  }
  ```
## ユーザー情報の編集 [PUT /api/v1/user/{user_id}]
ユーザーの情報を登録するためのエンドポイント
+ Request
  + Body
  ```
  {
    "user_name": ["update User A", "update User B"],
    "children_names": ["update Child One", "update Child Two"]
  }
  ```
+ Response 201 Created
  + Body
  ```
  {
    "message": "User registered successfully",
    "user_id": "12345"
  }
## 子どもの追加 [POST /api/v1/user/{user_id}/children]
子どもの情報の追加
+ Request
  + Body
  ```
  {
    "child_name": "New Child"
  }
  ```
+ Response 201 Created
  + Body
  ```
  {
    "child_id": "54321"
  }
  ```
+ Response 400 Bad Request 
  + Body
  ```
  {
    "error": "不正なリクエストです。"
  }
  ```

# 記録管理エンドポイント
## 各月画面データ取得 [GET /api/v1/main]
+ クエリパラメーター
  + month（必須）: `2024-06`
  + child_name（任意）: `Child One`
+ Response 200 OK
  + Body
    ```
    {
      "summary": {
        "dates": [
          {
            "date": "2024-06-01",
            "activities": [
              {
                "user_name": "User One",
                "activity": "Reading",
                "start_time": "10:00",
                "end_time": "11:00"
              }
            ]
          }
        ],
        "ratios": {
          "User One": 50,
          "User Two": 50
        }
      },
      "analysis": {
        "llm_summary": "LLMの要約結果",
        "llm_sentiment": "ポジティブ"
      }
    }
    ```
+ Response 400 Bad Request
  + Body
  ```
    {
      "error": "不正なリクエストです。"
    }
  ```
## 新しい記録の追加 [POST /api/v1/records]
子どもとの時間の記録を追加するためのエンドポイント
+ Request
  + Body
    ```
    {
      "user_id": "12345",
      "child_name": "Child One",
      "activity": "Reading",
      "start_time": "2024-06-01T10:00:00",
      "end_time": "2024-06-01T11:00:00"
    }
    ```
+ Response 201 Created
  + Body
    ```
    {
      "message": "記録を追加しました。",
      "record_id": "67890"
    }
    ```
+ Response 400 Bad Request
  + Body
    ```
    {
      "error": "不正なリクエストです。"
    }
    ```
<!-- 第2段階で実装
## 記録の更新 [POST /api/v1/records/{record_id}]
特定の記録を更新するためのエンドポイント
+ Request
  + Body
    ```
    {
      "type": "usage",
      "data": "Updated Usage Data"
    }
    ```
+ Response
  + Body
    ```
    {
      "message": "記録を編集しました"
    }
    ``` -->

# LLM
## LLM分析結果取得 [POST /api/v1/analysis]
+ Request (application/json)
  + Body
    ```
    {
      "text": "ユーザーが提供したテキスト",
      "user_id": "12345",
          "child_name": "Child One",
          "month": "2024-06",
          "activities": [
            {
              "record_id": "11111",
              "activity": "Reading",
              "start_time": "2024-06-01T10:00:00",
              "end_time": "2024-06-01T11:00:00"
            },
            {
              "record_id": "22222",
              "activity": "Playing",
              "start_time": "2024-06-01T15:00:00",
              "end_time": "2024-06-01T16:00:00"
            }
          ]
    }
    ```
+ Response 200 (application/json)
  + Body
    ```
    {
      "summary": "LLMによる要約",
      "sentiment": "ポジティブ"
    }
    ```