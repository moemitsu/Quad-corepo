# Firebaseの初期化をします
import firebase_admin
from firebase_admin import credentials

print('----------------------firebase1')
cred = credentials.Certificate("/src/serviceAccountKey.json")
firebase_admin.initialize_app(cred)
print('----------------------firebase2')