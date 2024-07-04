#! /bin/bash

cd /src

poetry run uvicorn api.main:app --host 0.0.0.0 --reload
sleep 30
poetry run alembic revision --autogenerate -m "Initial migration"
poetry run alembic upgrade head
poetry run python -m api.database.seed