from fastapi import FastAPI
from google_calendar import google_calendar_all_exclude_holidays

app = FastAPI()

@app.get("/")
async def index():
    return {"message":"FastAPIだぞ"}

@app.get("/calendar/events")
def get_calendar_events():
    return google_calendar_all_exclude_holidays()
