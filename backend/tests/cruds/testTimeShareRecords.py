import datetime
import calendar
from sqlalchemy.orm import Session
from backend.api.database import models
from backend.api.cruds.timeShareRecords import (
    getRecordsByMonth,
    createRecords,
    getRecordsAnalysis
)

def test_getRecordsByMonth(test_db: Session):
    # テストデータの準備
    record = models.TimeShareRecords(
        stakeholder_id=1,
        with_member='Parent',
        child_name='Child1',
        events='Event1',
        child_condition='Good',
        place='Home',
        share_start_at=datetime.datetime(2023, 6, 1, 0, 0, 0),
        share_end_at=datetime.datetime(2023, 6, 30, 23, 59, 59)
    )
    test_db.add(record)
    test_db.commit()

    # 関数の呼び出しと検証
    records = getRecordsByMonth(test_db, 'Child1', 2023, 6)
    assert len(records) == 1
    assert records[0].events == 'Event1'

def test_createRecords(test_db: Session):
    # 関数の呼び出し
    new_record = createRecords(
        db=test_db,
        stakeholder_id=1,
        with_member='Parent',
        child_name='Child2',
        events='Event2',
        child_condition='Good',
        place='School',
        share_start_at=datetime.datetime(2023, 7, 1, 9, 0, 0),
        share_end_at=datetime.datetime(2023, 7, 1, 17, 0, 0)
    )

    # 検証
    assert new_record.child_name == 'Child2'
    assert new_record.events == 'Event2'

def test_getRecordsAnalysis(test_db: Session):
    # テストデータの準備
    record1 = models.TimeShareRecords(
        stakeholder_id=1,
        with_member='Parent',
        child_name='Child3',
        events='Event3',
        child_condition='Good',
        place='Park',
        share_start_at=datetime.datetime(2023, 5, 1, 10, 0, 0),
        share_end_at=datetime.datetime(2023, 5, 1, 12, 0, 0)
    )
    record2 = models.TimeShareRecords(
        stakeholder_id=1,
        with_member='Parent',
        child_name='Child3',
        events='Event4',
        child_condition='Fair',
        place='Zoo',
        share_start_at=datetime.datetime(2023, 5, 2, 10, 0, 0),
        share_end_at=datetime.datetime(2023, 5, 2, 12, 0, 0)
    )
    test_db.add(record1)
    test_db.add(record2)
    test_db.commit()

    # 関数の呼び出しと検証
    records = getRecordsAnalysis(test_db, 1, 'Child3')
    assert len(records) == 2
    assert records[0].events == 'Event3'
    assert records[1].events == 'Event4'
