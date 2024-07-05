from sqlalchemy.orm import Session
from api.database.db import SessionLocal
from api.database.models import Stakeholder, User, Payments, TimeShareRecords
from uuid import uuid4
from datetime import datetime

def seed_data(db: Session):
    # Generate UUIDs for stakeholders
    stakeholder1_id = uuid4()
    stakeholder2_id = uuid4()

    initial_data = [
        Stakeholder(id=stakeholder1_id, stakeholder_name='山田さんち', firebase_id=''),
        Stakeholder(id=stakeholder2_id, stakeholder_name='佐藤家', firebase_id=''),
        User(stakeholder_id=stakeholder1_id, adult_name='母', child_name=''),
        User(stakeholder_id=stakeholder1_id, adult_name='父', child_name=''),
        User(stakeholder_id=stakeholder2_id, adult_name='祖母', child_name=''),
        User(stakeholder_id=stakeholder2_id, adult_name='', child_name='はなこ'),
        User(stakeholder_id=stakeholder1_id, adult_name='', child_name='たろう'),
        Payments(user_id=1, stakeholder_id=stakeholder1_id),  # user_idはオートインクリメントの最初のUserのID
        Payments(user_id=3, stakeholder_id=stakeholder2_id),  # user_idはオートインクリメントの次のUserのID
        TimeShareRecords(stakeholder_id=stakeholder1_id, with_member='父', child_name='たろう', events='遊び', child_condition='☀️', place='公園', share_start_at=datetime(2024, 5, 5, 10, 0, 0), share_end_at=datetime(2024, 6, 5, 16, 0, 0)),
        TimeShareRecords(stakeholder_id=stakeholder1_id, with_member='母', child_name='たろう', events='遊び', child_condition='☀️', place='公園', share_start_at=datetime(2024, 6, 5, 10, 0, 0), share_end_at=datetime(2024, 6, 5, 16, 0, 0)),
        TimeShareRecords(stakeholder_id=stakeholder2_id, with_member='祖母', child_name='はなこ', events='勉強', child_condition='☁️', place='家', share_start_at=datetime(2024, 6, 10, 13, 0, 0), share_end_at=datetime(2024, 6, 10, 18, 0, 0)),
        TimeShareRecords(stakeholder_id=stakeholder1_id, with_member='父', child_name='たろう', events='勉強', child_condition='☂️☂️', place='家', share_start_at=datetime(2024, 6, 6, 20, 0, 0), share_end_at=datetime(2024, 6, 6, 21, 30, 0)),
        TimeShareRecords(stakeholder_id=stakeholder2_id, with_member='祖母', child_name='はなこ', events='遊び', child_condition='☀️☀️', place='その他', share_start_at=datetime(2024, 6, 11, 10, 40, 0), share_end_at=datetime(2024, 6, 11, 13, 30, 0)),
    ]
    
    db.bulk_save_objects(initial_data)
    db.commit()

if __name__ == '__main__':
    db = SessionLocal()
    try:
        seed_data(db)
    finally:
        db.close()
