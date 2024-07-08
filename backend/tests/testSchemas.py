import pytest
from pydantic import ValidationError
from api.schemas import (
    LoginReq, LoginRes, Error, StakeHolderReq, StakeholderRes, 
    UserReq, UserRes, PostChildReq, PostChildRes, RecordReq, 
    RecordRes, LLMReq, LLMRes
)
import datetime

def test_login_req():
    login_req = LoginReq(firebase_id="mock_firebase_id")
    assert login_req.firebase_id == "mock_firebase_id"

def test_login_res():
    login_res = LoginRes(firebase_id="mock_firebase_id")
    assert login_res.firebase_id == "mock_firebase_id"

def test_error():
    error = Error(error="An error occurred")
    assert error.error == "An error occurred"

def test_stakeholder_req():
    stakeholder_req = StakeHolderReq(stakeholder_name="John Doe", firebase_id="mock_firebase_id")
    assert stakeholder_req.stakeholder_name == "John Doe"
    assert stakeholder_req.firebase_id == "mock_firebase_id"

def test_stakeholder_res():
    stakeholder_res = StakeholderRes(message="登録完了", stakeholder_id=1)
    assert stakeholder_res.message == "登録完了"
    assert stakeholder_res.stakeholder_id == 1

def test_user_req():
    user_req = UserReq(stakeholder_id=1, adult_name="John", child_name="Doe")
    assert user_req.stakeholder_id == 1
    assert user_req.adult_name == "John"
    assert user_req.child_name == "Doe"

def test_user_res():
    user_res = UserRes(message="登録完了！", user_id=1)
    assert user_res.message == "登録完了！"
    assert user_res.user_id == 1

def test_post_child_req():
    post_child_req = PostChildReq(stakeholder_id=1, child_name="Doe")
    assert post_child_req.stakeholder_id == 1
    assert post_child_req.child_name == "Doe"

def test_post_child_res():
    post_child_res = PostChildRes(message="成功")
    assert post_child_res.message == "成功"

def test_record_req():
    share_start_at = datetime.datetime(2023, 7, 1, 0, 0, 0)
    share_end_at = datetime.datetime(2023, 7, 1, 1, 0, 0)
    record_req = RecordReq(
        stakeholder_id=1, with_member="Member", child_name="Doe", 
        events="Event", child_condition="Good", place="Park", 
        share_start_at=share_start_at, share_end_at=share_end_at
    )
    assert record_req.stakeholder_id == 1
    assert record_req.with_member == "Member"
    assert record_req.child_name == "Doe"
    assert record_req.events == "Event"
    assert record_req.child_condition == "Good"
    assert record_req.place == "Park"
    assert record_req.share_start_at == share_start_at
    assert record_req.share_end_at == share_end_at

def test_record_res():
    record_res = RecordRes(message="記録作成成功", record_id="1")
    assert record_res.message == "記録作成成功"
    assert record_res.record_id == "1"

def test_llm_req():
    llm_req = LLMReq(text="Analyze this text", stakeholder_id=1, child_name="Doe", year="2023", month="7")
    assert llm_req.text == "Analyze this text"
    assert llm_req.stakeholder_id == 1
    assert llm_req.child_name == "Doe"
    assert llm_req.year == "2023"
    assert llm_req.month == "7"

def test_llm_res():
    llm_res = LLMRes(summary="This is a summary", sentiment="Positive")
    assert llm_res.summary == "This is a summary"
    assert llm_res.sentiment == "Positive"

# バリデーションエラーのテスト
def test_invalid_user_req():
    with pytest.raises(ValidationError):
        UserReq(stakeholder_id="invalid_id", adult_name="John", child_name="Doe")

def test_invalid_record_req():
    with pytest.raises(ValidationError):
        share_start_at = "invalid_date"
        share_end_at = datetime.datetime(2023, 7, 1, 1, 0, 0)
        RecordReq(
            stakeholder_id=1, with_member="Member", child_name="Doe", 
            events="Event", child_condition="Good", place="Park", 
            share_start_at=share_start_at, share_end_at=share_end_at
        )
