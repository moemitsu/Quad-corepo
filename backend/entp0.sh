#! /usr/bin/bash

poetry run uvicorn api.main:app --host 0.0.0.0 --reload