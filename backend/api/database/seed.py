import random
from sqlalchemy.orm import Session
from api.database.db import SessionLocal
from api.database.models import Stakeholder, User, Payments, TimeShareRecords
from uuid import uuid4
from datetime import datetime, timedelta

def seed_data(db: Session):
	# UUIDの生成
	stakeholder1_id = uuid4()
	stakeholder2_id = uuid4()

	# シード用のデータ
	surnames = ['佐藤', '鈴木', '高橋', '田中', '伊藤', '山本', '中村', '小林', '加藤', '吉田']
	members = ['父', '母', '祖父', '祖母', '保育士']
	children = ['はなこ', 'たろう', 'いちろう', 'ふたば']
	events = ['遊び', '勉強', 'おでかけ', 'その他']
	conditions = ['☀️☀️', '☀', '☁', '☂', '☂☂']
	places = ['公園', '家', 'その他']

	def random_date(start, end):
		delta = end - start
		int_delta = (delta.days * 24 * 60 * 60) + delta.seconds
		random_second = random.randrange(int_delta)
		return start + timedelta(seconds=random_second)

	# TimeShareRecordsの生成
	time_share_records = []
	start_date = datetime(2024, 4, 1, 8, 0, 0)
	end_date = datetime(2024, 7, 31, 22, 0, 0)
	for _ in range(100):  # 100個のレコードを生成
		share_start_at = random_date(start_date, end_date)
		share_end_at = share_start_at + timedelta(minutes=random.randint(30, 120))
		time_share_records.append(
			TimeShareRecords(
				stakeholder_id=random.choice([stakeholder1_id, stakeholder2_id]),
				with_member=random.choice(members),
				child_name=random.choice(children),
				events=random.choice(events),
				child_condition=random.choice(conditions),
				place=random.choice(places),
				share_start_at=share_start_at,
				share_end_at=share_end_at
			)
		)

	initial_data = [
		Stakeholder(id=stakeholder1_id, stakeholder_name=f'{random.choice(surnames)}家', firebase_id=''),
		Stakeholder(id=stakeholder2_id, stakeholder_name=f'{random.choice(surnames)}家', firebase_id=''),
		User(stakeholder_id=stakeholder1_id, adult_name='母', child_name=''),
		User(stakeholder_id=stakeholder1_id, adult_name='父', child_name=''),
		User(stakeholder_id=stakeholder2_id, adult_name='祖母', child_name=''),
		User(stakeholder_id=stakeholder2_id, adult_name='', child_name='はなこ'),
		User(stakeholder_id=stakeholder1_id, adult_name='', child_name='たろう'),
		Payments(user_id=1, stakeholder_id=stakeholder1_id),  # user_idはオートインクリメントの最初のUserのID
		Payments(user_id=3, stakeholder_id=stakeholder2_id),  # user_idはオートインクリメントの次のUserのID
	] + time_share_records
	
	db.bulk_save_objects(initial_data)
	db.commit()

if __name__ == '__main__':
	db = SessionLocal()
	try:
		seed_data(db)
	finally:
		db.close()