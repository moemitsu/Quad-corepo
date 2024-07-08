import pytest
from fastapi.testclient import TestClient
from api.main import app

client = TestClient(app)

def test_read_root():
    response = client.get("/")
    assert response.status_code == 200
    assert response.json() == {"message": "Welcome to the FastAPI application"}

def test_protected_route():
    # モックユーザーデータを設定
    app.dependency_overrides[app.state.user] = lambda: {"name": "test_user"}

    response = client.get("/protected-route")
    assert response.status_code == 200
    assert response.json() == {"message": "Hello, test_user"}

    # テスト後に依存関係のオーバーライドを解除
    del app.dependency_overrides[app.state.user]

def test_cors_headers():
    response = client.options("/")
    assert response.status_code == 200
    assert response.headers["access-control-allow-origin"] in ["http://localhost:3000", "https://localhost:3000"]
    assert response.headers["access-control-allow-credentials"] == "true"
    assert "GET" in response.headers["access-control-allow-methods"]
    assert "POST" in response.headers["access-control-allow-methods"]
    assert "PUT" in response.headers["access-control-allow-methods"]
    assert "DELETE" in response.headers["access-control-allow-methods"]
