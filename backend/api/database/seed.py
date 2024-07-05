from sqlalchemy.orm import Session
from api.database.db import SessionLocal
from api.database.Models import Stakeholder, User, Payments, TimeShareRecords
from uuid import uuid4


def seed_data(db: Session):
  stakeholder1_id = uuid4()
  stakeholder2_id = uuid4()
  
  user1_id = uuid4()
  user2_id = uuid4()
  user3_id = uuid4()
  user4_id = uuid4()
  user5_id = uuid4()
  payment1_id = uuid4()
  payment2_id = uuid4()
  
  initial_data = [
    Stakeholder(id=stakeholder1_id, stakeholder_name='山田さんち', firebase_id=''),
    Stakeholder(id=stakeholder2_id, stakeholder_name='佐藤家', firebase_id=''),
    User(id=user1_id, stakeholder_id=stakeholder1_id, adult_name='母', child_name=''),
    User(id=user2_id, stakeholder_id=stakeholder1_id, adult_name='父', child_name=''),
    User(id=user3_id, stakeholder_id=stakeholder2_id, adult_name='祖母', child_name=''),
    User(id=user4_id, stakeholder_id=stakeholder2_id, adult_name='', child_name='はなこ'),
    User(id=user5_id, stakeholder_id=stakeholder1_id, adult_name='', child_name='たろう'),
    Payments(id=payment1_id, user_id=user1_id, stakeholder_id=stakeholder1_id),
    Payments(id=payment2_id, user_id=user3_id, stakeholder_id=stakeholder2_id),
    TimeShareRecords(id=uuid4(), stakeholder_id=stakeholder1_id, with_member='父', child_name='たろう',events='遊び', child_condition='☀️', place='公園', share_start_at='2024-05-05 10:00:00', share_end_at='2024-06-05 16:00:00'),
    TimeShareRecords(id=uuid4(), stakeholder_id=stakeholder1_id, with_member='母', child_name='たろう',events='遊び', child_condition='☀️', place='公園', share_start_at='2024-06-05 10:00:00', share_end_at='2024-06-05 16:00:00'),
    TimeShareRecords(id=uuid4(), stakeholder_id=stakeholder2_id, with_member='祖母', child_name='はなこ',events='勉強', child_condition='☁️', place='家', share_start_at='2024-06-10 13:00:00', share_end_at='2024-06-10 18:00:00'),
    TimeShareRecords(id=uuid4(), stakeholder_id=stakeholder1_id, with_member='父', child_name='たろう',events='勉強', child_condition='☂️☂️', place='家', share_start_at='2024-06-06 20:00:00', share_end_at='2024-06-06 21:30:00'),
    TimeShareRecords(id=uuid4(), stakeholder_id=stakeholder2_id, with_member='祖母', child_name='はなこ',events='遊び', child_condition='☀️☀️', place='その他', share_start_at='2024-06-11 10:40:00', share_end_at='2024-06-11 13:30:00'),
  ]
  db.bulk_save_objects(initial_data)
  db.commit()

if __name__ == '__main__':
  db = SessionLocal()
  try:
    seed_data(db)
  finally:
    db.close()
