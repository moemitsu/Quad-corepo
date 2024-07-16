import random
from sqlalchemy.orm import Session
from api.database.db import SessionLocal
from api.database.models import Stakeholder, User, Payments, TimeShareRecords
from uuid import uuid4
from datetime import datetime, timedelta
import os
from dotenv import load_dotenv

load_dotenv()  # 環境変数を読み込む

def seed_data(db: Session):
    # UUIDの生成
    stakeholder1_id = uuid4()
    stakeholder2_id = uuid4()
    
    Firebase1 = os.getenv('FIREBASE_UID1')
    Firebase2 = os.getenv('FIREBASE_UID2')

    # シード用のデータ
    surnames = ['佐藤', '鈴木', '高橋', '田中', '伊藤', '山本', '中村', '小林', '加藤', '吉田']
    members = ['父', '母', '祖父', '祖母', '保育士']
    events = ['遊び', '勉強', 'おでかけ', 'その他']
    conditions = ['☀️☀️', '☀', '☁', '☂', '☂☂']
    places = ['公園', '家', 'その他']

    # TimeShareRecordsのための日付生成関数
    def random_date(start, end):
        delta = end - start
        int_delta = (delta.days * 24 * 60 * 60) + delta.seconds
        random_second = random.randrange(int_delta)
        return start + timedelta(seconds=random_second)

    # ステークホルダーとユーザーの生成
    stakeholders = [
        Stakeholder(id=stakeholder1_id, stakeholder_name=f'{random.choice(surnames)}家', firebase_id=f'{Firebase1}'),
        Stakeholder(id=stakeholder2_id, stakeholder_name=f'{random.choice(surnames)}家', firebase_id=f'{Firebase2}')
    ]

    users = [
        User(stakeholder_id=stakeholder1_id, adult_name='母', child_name=None),
        User(stakeholder_id=stakeholder1_id, adult_name='父', child_name=None),
        User(stakeholder_id=stakeholder2_id, adult_name='祖母', child_name=None),
        User(stakeholder_id=stakeholder2_id, adult_name='父', child_name=None),
        User(stakeholder_id=stakeholder2_id, adult_name=None, child_name='いちろう'),
        User(stakeholder_id=stakeholder2_id, adult_name=None, child_name='はなこ'),
        User(stakeholder_id=stakeholder1_id, adult_name=None, child_name='たろう'),
        User(stakeholder_id=stakeholder1_id, adult_name=None, child_name='ふたば')
    ]

    payments = [
        Payments(user_id=1, stakeholder_id=stakeholder1_id),  # user_idはオートインクリメントの最初のUserのID
        Payments(user_id=3, stakeholder_id=stakeholder2_id)   # user_idはオートインクリメントの次のUserのID
    ]

    # データベースに保存
    db.bulk_save_objects(stakeholders + users + payments)
    db.commit()

    # ユーザーデータを取得
    child_users = db.query(User).filter(User.child_name.isnot(None)).all()
    member_users = db.query(User).filter(User.adult_name.isnot(None)).all()

    # TimeShareRecordsの生成
    time_share_records = []
    start_date = datetime(2024, 4, 1, 8, 0, 0)
    end_date = datetime(2024, 7, 31, 22, 0, 0)

    for _ in range(300):  # 100個のレコードを生成
        share_start_at = random_date(start_date, end_date)
        share_end_at = share_start_at + timedelta(minutes=random.randint(30, 120))
        child_user = random.choice(child_users)
        member_user = random.choice(member_users)

        time_share_records.append(
            TimeShareRecords(
                stakeholder_id=child_user.stakeholder_id,
                with_member=member_user.adult_name,
                child_name=child_user.child_name,
                events=random.choice(events),
                child_condition=random.choice(conditions),
                place=random.choice(places),
                share_start_at=share_start_at,
                share_end_at=share_end_at
            )
        )

    db.bulk_save_objects(time_share_records)
    db.commit()

if __name__ == '__main__':
    db = SessionLocal()
    try:
        seed_data(db)
    finally:
        db.close()
