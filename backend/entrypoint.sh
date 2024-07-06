#! usr/bin/bash
set -e  # エラーが発生した場合にスクリプトを終了する


poetry run uvicorn api.main:app --host 0.0.0.0 --reload  >> output.log
log=$(grep -q "done" output.log ) 
  echo "waiting starting app1"

echo $log
  echo "waiting starting app2"
while [ -z $log ]
do 
  echo "waiting starting app"
  sleep 0.5
done

# output.logをクリア
> output.log

# 初期マイグレーションの作成
echo "Running: poetry run alembic revision --autogenerate -m 'Initial migration'"
poetry run alembic revision --autogenerate -m "Initial migration" | tee output.log


# 'done'の確認
if grep -q "done" output.log; then
  echo "Initial migration generated successfully."
else
  echo "Failed to generate initial migration." >&2
  exit 1
fi

# output.logをクリア
> output.log

# マイグレーションの適用
echo "Running: poetry run alembic upgrade head"
poetry run alembic upgrade head | tee output.log

# 'Initial migration'の確認
if grep -q "Initial migration" output.log; then
  echo "Migration applied successfully."
else
  echo "Failed to apply migration." >&2
  exit 1
fi

# output.logをクリア
> output.log

# データベースのシード
echo "Running: poetry run python -m api.database.seed"
poetry run python -m api.database.seed

echo "All steps completed successfully."