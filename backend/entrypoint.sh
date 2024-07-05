#!/bin/sh

sleep 30
poetry run alembic revision --autogenerate -m "Initial migration"
poetry run alembic upgrade head
poetry run python -m api.database.seed