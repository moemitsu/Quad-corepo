# firebaseのトークン検証
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from firebase_admin import credentials, auth
from api.lib.firebase import cred

# FastAPIの認証スキーマ
security = HTTPBearer()

# トークンを検証し、ユーザー情報を取得する関数
def verify_token(credentials: HTTPAuthorizationCredentials = Depends(security)):
  token = credentials.credentials
  try:
    decoded_token = auth.verify_id_token(token)
    return decoded_token
  except Exception as e:
    raise HTTPException(
      status_code=status.HTTP_401_UNAUTHORIZED,
      detail="Invalid authentication credentials",
      headers={"WWW-Authenticate": "Bearer"},
    )

# 認証されたユーザーを取得する依存関数
def get_current_user(decoded_token: dict = Depends(verify_token)):
  uid = decoded_token.get("uid")
  user = auth.get_user(uid)
  return user
