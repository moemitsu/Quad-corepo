#! usr/bin/bash
set -e  # エラーが発生した場合にスクリプトを終了する
# server立ち上げ
poetry run uvicorn api.main:app --host 0.0.0.0 --reload --log-config logging.yaml # NOTE ここにコメントアウトがないとコンテナでサーバー立ち上げの際にエラーが出ます。
# 初期マイグレーションの作成
poetry run alembic revision --autogenerate -m "Initial migration"
if grep -q "done"
  echo "Initial migration generated successfully."
else
  echo "Failed to generate initial migration."
  exit 1
fi
# マイグレーションの適用
poetry run alembic upgrade head
if grep -q "Initial migration"
  echo "Migration applied successfully."
else
  echo "Failed to apply migration."
  exit 1
fi
# データベースのシード
poetry run python -m api.database.seed
echo "All steps completed successfully."