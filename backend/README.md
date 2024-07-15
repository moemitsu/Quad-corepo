# corepo API仕様書

| 機能         | メソッド | パス          | 説明                       |
|--------------|---------|--------------|----------------------------|
| ユーザー情報登録 | POST | `/api/v1/user` | 新規登録時にUser情報を登録 |
| ユーザー情報表示 | GET | `/api/v1/user-info` | ヘッダーに名前表示のための取得 |
| ユーザー情報編集 | PUT | `/api/v1/user/{user_id}` | ユーザー情報の更新 |
| 利用者と子供の名前の取得 | GET | `/api/v1/names` | 利用者と子どもの名前を取得（記録の追加用） |
| 記録の追加 | POST | `/api/v1/record` | 子どもとの時間の記録を登録 |
| 棒グラフ表示用データを取得 | GET | `/api/v1/bar-graph` | 各月画面に表示されるすべてのデータを取得 |
| 円グラフ表示用データを取得 | GET | `/api/v1/pie-graph` | 各月画面に表示されるすべてのデータを取得 |
| 家族データ一覧の取得 | GET | `/api/v1/family-records` | 各月画面の表示に使用されたデータの詳細を取得 |
| LLM分析 | POST | `/api/v1/analysis` | LLMにデータとテキストを送信して分析結果を取得する |
| stripe決済 | POST | `/stripe/create-checkout-session` | Stripeチェックアウト方式デフォルト |
| stripe決済 | POST | `/stripe/session-status` | Stripeチェックアウト方式デフォルト |
| 決済済登録 | POST | `/payments/api/v1/payments` | 決済完了すると、DBにレコードされる |

<!--第2段階で実装
| 記録の更新 | PUT | `/api/v1/records/{record_id}` | 特定の記録の更新 |
-->

# ユーザー情報管理エンドポイント
## ユーザー登録 [POST /api/v1/user]
ユーザーの情報を登録するためのエンドポイント
+ Request
  + Header
    ```
    {
      "Authorization": "Bearer ${idToken}"
    }
    ```
  + Body
    ```
    {
    "stakeholder_name": "家族の名前",
    "adult_names": ["成人1", "成人2"],
    "child_names": ["子供1", "子供2"]
    }
    ```
+ Response 201 Created
  + Body
    ```
    {
      "message": "ユーザー情報を登録しました",
    }
    ```
+ Response 500 Bad Request
  + Body
    ```
    {
      "error": "ユーザー情報の登録に失敗しました{エラー内容}"
    }
    ```
## ユーザー情報の編集 [PUT /api/v1/user/{user_id}]
ユーザーの情報を登録するためのエンドポイント
+ Request
  + Header
    ```
    {
      "Authorization": "Bearer ${idToken}"
    }
    ```
  + Body
    ```
    {
      "stakeholder_id": stakeholder_id,
      "adult_name": "トメ",
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
## ユーザー情報表示 [GET /api/v1/user-info]
ヘッダーに名前表示のための取得
+ Request
  + Header
    ```
    {
      "Authorization": "Bearer ${idToken}"
    }
    ```
+ Response 201 Created
  + Body
    ```
    {
    "stakeholder_id" = "--------uuid----------"
    "stakeholder_name" = "佐藤"
    "message"=f'{stakeholder.stakeholder_name}さん、こんにちは'
    }
    ```

## 利用者と子供の名前の取得 [GET /api/v1/names]
利用者と子どもの名前を取得（記録の追加用）
+ Request
  + Header
    ```
    {
      "Authorization": "Bearer ${idToken}"
    }
    ```
+ Response 201 Created
  + Body
    ```
    {
    "adult_names": ["成人1", "成人2"],
    "child_names": ["子供1", "子供2"]
    }
    ```

# 記録管理エンドポイント
## 新しい記録の追加 [POST /api/v1/record]
子どもとの時間の記録を追加するためのエンドポイント
+ Request
  + Header
    ```
    {
      "Authorization": "Bearer ${idToken}"
    }
    ```
  + Body
    ```
    {
      "stakeholder_id": stakeholder_id,
      "with_member": "祖母",
      "child_name": "はなこ",
      "events": "遊び",
      "child_condition": "☀️☀️",
      "place": "公園",
      "share_start_at": "2024-06-01T10:00:00",
      "share_end_at": "2024-06-01T11:00:00"
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
      "error": "記録の作成中にエラーが発生しました"
    }
    ```

## 棒グラフ用データ取得 [GET /api/v1/bar-graph]
各月画面に表示されるすべてのデータを取得
+ Request
  + Query Parameter
    + year（必須）: `2024`
    + month（必須）: `6`
    + child_name（必須）: `たろう`
  + Header
    ```
    {
      "Authorization": "Bearer ${idToken}"
    }
    ```
+ Response 200 OK
  + Body
    ```
    {
      "父": {
          "2024-07-01": 2.5,
          "2024-07-02": 1.0
      },
      "母": {
          "2024-07-01": 3.0,
          "2024-07-03": 2.0
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

## 円グラフ用データ取得 [GET /api/v1/pie-graph]
+ Request
  + Query Parameter
    + year（必須）: `2024`
    + month（必須）: `6`
    + child_name（必須）: `たろう`
  + Header
    ```
    {
      "Authorization": "Bearer ${idToken}"
    }
    ```
+ Response 200 OK
  + Body
    ```
    {
      "父": 40.0,
      "母": 60.0
    }
    ```
+ Response 400 Bad Request
  + Body
    ```
    {
      "error": "不正なリクエストです。"
    }
    ```

## 家族データ一覧の取得 [GET /api/v1/family-records]
各月画面の表示に使用されたデータの詳細を取得
+ Request
  + Query Parameter
    + year（必須）: `2024`
    + month（必須）: `6`
    + child_name（必須）: `たろう`
  + Header
    ```
    {
      "Authorization": "Bearer ${idToken}"
    }
    ```
+ Response 200 OK
  + Body
    ```
    {
      "id":"id"
      "with_member": "祖母",
      "events": "遊び",
      "child_condition": "☀️☀️",
      "place": "公園",
      "share_start_at": "2024-06-01T10:00:00",
      "share_end_at": "2024-06-01T11:00:00"
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
  + Header
    ```
    {
      "Authorization": "Bearer ${idToken}"
    }
    ```
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

# Stripe決済
## Stripe決済チェックアウト方式 [POST /stripe/create-checkout-session ]
+ Request (application/json)
+ Response 200 (application/json)
## Stripe決済チェックアウト方式 [POST /stripe/session-status ]
+ Request (application/json)
+ Response 200 (application/json)
## 決済済登録 [POST /payments/api/v1/payments ]
+ Request (application/json)
  + Header
    ```
    {
      "Authorization": "Bearer ${idToken}"
    }
    ```
  + Body
    ```
    {
    "id":"id"
    stakeholder_id:"---------uuid---------"
    user_id=1
    }
    ```
+ Response 200 (application/json)
  + Body
    ```
    ```