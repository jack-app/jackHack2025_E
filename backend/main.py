from fastapi import FastAPI
from google_calendar import google_calendar_next_month_exclude_holidays
from pydantic import BaseModel
from typing import List
from chatgpt import get_cancel_reason_list, generate_cancel_message, get_cancel_reasons_by_index


app = FastAPI()

@app.get("/")
async def index():
    return {"message":"FastAPIだぞ"}

@app.get("/calendar/events")
def get_calendar_events():
    return google_calendar_next_month_exclude_holidays()

class ScheduleInput(BaseModel):
    schedule: str

class ReasonSelection(BaseModel):
    schedule: str
    reason: str

# --------------------------
# キャンセルメッセージを生成
# --------------------------
class ReasonSelection(BaseModel):
    schedule: str
    reason: str

class IndexInput(BaseModel):
    index: int

@app.post("/cancel/message")
def get_cancel_message(input: ReasonSelection):
    return generate_cancel_message(input.schedule, input.reason)


class CancelReasonResponse(BaseModel):
    index: int
    start: str
    summary: str
    cancel_reasons: List[str]

@app.post("/cancel/reasons", response_model=CancelReasonResponse)
def cancel_reasons(input: IndexInput):
    return get_cancel_reasons_by_index(input.index)


