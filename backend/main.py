from fastapi import FastAPI
from google_calendar import google_calendar_next_month_exclude_holidays
from pydantic import BaseModel
from typing import List
from chatgpt import get_cancel_reason_list, generate_cancel_message, get_cancel_reasons_by_index


app = FastAPI()

from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # React の開発サーバー
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


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

class ScheduleInput(BaseModel):
    schedule:str

@app.post("/cancel/message")
def get_cancel_message(input: ReasonSelection):
    message = generate_cancel_message(input.schedule, input.reason)
    return {"message" : message}


class CancelReasonResponse(BaseModel):
    index: int
    start: str
    summary: str
    cancel_reasons: List[str]

@app.post("/cancel/reasons", response_model=CancelReasonResponse)
def cancel_reasons(input: IndexInput):
    return get_cancel_reasons_by_index(input.index)

@app.post("/cancel/reasons/manual", response_model=List[str])
def cancel_reasons_manual(input: ScheduleInput):
    return get_cancel_reason_list(input.schedule)


