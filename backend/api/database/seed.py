from sqlalchemy.orm import Session
from db import get_db, SessionLocal, engine
from models import Stakeholder, User, Payments, TimeShareRecords



def seed_data(db: Session):
  initial_data = [
    Stakeholder(stakeholder_name='山田さんち'),
    Stakeholder(stakeholder_name='佐藤家'),
    User(stakeholder_id=1, adalt_name='母'),
    User(stakeholder_id=1, adalt_name='父'),
    User(stakeholder_id=2, child_name='祖母'),
    User(stakeholder_id=2, adalt_name='はなこ'),
    User(stakeholder_id=1, child_name='たろう'),
    Payments(user_id=1, stakeholder_id=1),
    Payments(user_id=3, stakeholder_id=2),
    TimeShareRecords(stakeholder_id=1, with_member='父', child_name='たろう',events='遊び', child_condition='☀️', place='公園', share_start_at='2024-05-05 10:00:00', share_end_at='2024-06-05 16:00:00'),
    TimeShareRecords(stakeholder_id=1, with_member='母', child_name='たろう',events='遊び', child_condition='☀️', place='公園', share_start_at='2024-06-05 10:00:00', share_end_at='2024-06-05 16:00:00'),
    TimeShareRecords(stakeholder_id=2, with_member='祖母', child_name='はなこ',events='勉強', child_condition='☁️', place='家', share_start_at='2024-06-10 13:00:00', share_end_at='2024-06-10 18:00:00'),
    TimeShareRecords(stakeholder_id=1, with_member='父', child_name='たろう',events='勉強', child_condition='☂️☂️', place='家', share_start_at='2024-06-06 20:00:00', share_end_at='2024-06-06 21:30:00'),
    TimeShareRecords(stakeholder_id=2, with_member='祖母', child_name='はなこ',events='遊び', child_condition='☀️☀️', place='その他', share_start_at='2024-06-11 10:40:00', share_end_at='2024-06-11 13:30:00'),
  ]
  db.session.bulk_save_objects(initial_data)
  db.session.commit()

if __name__ == '__main__':
  db = SessionLocal()
  try:
    seed_data(get_db)
  finally:
    get_db.close()
