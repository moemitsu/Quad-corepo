# corepo（これぽ）
家族（特に子供）との時間を記録し、可視化および分析することで家族の絆を深めるための分析・提案サービス

![ダッシュボード画面]
(https://github.com/user-attachments/assets/39c0327b-43a2-4d59-bf1d-4f83cebed3fb)
(https://github.com/user-attachments/assets/01203c0a-cc96-48da-8d92-76ad4ff8ae69)
(https://github.com/user-attachments/assets/f2cef917-3196-4bf2-9f95-1dfa150c891d)
(https://github.com/user-attachments/assets/25b3746f-8e9a-4068-af57-82bce097e19a)

## 操作動画

[操作動画を見る](link_to_your_demo_video)

## 機能

- **ユーザー認証**: Firebaseを使用したユーザー認証
- **家族情報との登録**: 記録・分析したい家族の名前を登録
- **活動記録の登録**: 誰と・どこで・何をして・機嫌・時間を記録
- **データの可視化**: Chart.jsを使用した円グラフ、棒グラフ表示
- **データの管理**: PostgreSQLデータベースを使用したデータの保存
- **分析結果・過ごし方提案**: OpenAIを使用した月間分析結果の提供


## 使い方

### 1. リポジトリのクローン
```sh 
 $ git clone https://github.com/yourusername/your-repository.git
```
### 2.ルートディレクトリへ移動
```sh
 $ cd your-repository
```
### 3.dockerでビルドする
```sh
 $ docker compose up --build
```
### 4.アプリにアクセスする
```sh
$ http://localhost:3000
```

## 使用技術
![使用技術画像](https://github.com/user-attachments/assets/c0de1999-fd2a-4cd4-a398-301de777be37)

 - Next.js(AppRouter): 14.2.4
 - TypeScript: 5.5.2
 - Tailwind CSS: 3.4.4
 - Python: 3.12
 - FastAPI: 0.111.0
 - PostgreSQL（Dockerで起動）
 - Firebase: 10.12.3
 - Stripe: 16.1.0
 - OpenAI: 1.35.10
 - pandas: 2.2.2
 - Chart.js: 4.4.3
 - SQLAlchemy: 2.0.31
 - Docker:
 - aws:

## システム構成
![アーキテクチャ図](path_to_your_aws_image.png)