# # firebaseのトークン検証
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from firebase_admin import credentials, auth
import firebase_admin
from logging import config, getLogger
from api.lib.firebase import cred

logger = getLogger(__name__)

# FastAPIの認証スキーマ
security = HTTPBearer()
print('-------------------firebase2.5')
# トークンを検証し、ユーザー情報を取得する関数
def verify_token(credentials: HTTPAuthorizationCredentials = Depends(security)):
  print('-------------------firebase3')
  token = credentials.credentials
  print(token,'-------------------firebase4')
  try:
    decoded_token = auth.verify_id_token(token)
    print(decoded_token)
    return decoded_token
  except Exception as e:
    print(f"Token verification failed: {e}")
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
