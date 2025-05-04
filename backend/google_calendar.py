import datetime
import os.path

from google.auth.transport.requests import Request
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import InstalledAppFlow
from googleapiclient.discovery import build
from googleapiclient.errors import HttpError

SCOPES = ["https://www.googleapis.com/auth/calendar.readonly"]

def google_calendar_next_month_exclude_holidays():
    """
    現在から1ヶ月分の全カレンダーの予定（祝日除く）を取得し、index・start・summary を出力する。
    """
    creds = None
    if os.path.exists("token.json"):
        creds = Credentials.from_authorized_user_file("token.json", SCOPES)

    if not creds or not creds.valid:
        if creds and creds.expired and creds.refresh_token:
            creds.refresh(Request())
        else:
            flow = InstalledAppFlow.from_client_secrets_file(
                "credentials.json", SCOPES
            )
            creds = flow.run_local_server(port=0)
        with open("token.json", "w") as token:
            token.write(creds.to_json())

    try:
        service = build("calendar", "v3", credentials=creds)

        now = datetime.datetime.now(datetime.UTC)
        one_month_later = now + datetime.timedelta(days=30)

        time_min = now.isoformat()
        time_max = one_month_later.isoformat()

        print("1ヶ月以内の予定を取得中（祝日除く）")

        calendar_list = service.calendarList().list().execute()

        # 「祝日」カレンダーIDの特定
        holiday_calendar_ids = [
            calendar["id"]
            for calendar in calendar_list["items"]
            if "祝日" in calendar.get("summary", "") or "Holiday" in calendar.get("summary", "")
        ]

        all_events = []

        for calendar in calendar_list["items"]:
            calendar_id = calendar["id"]
            summary = calendar.get("summary", "")

            if calendar_id in holiday_calendar_ids:
                print(f"スキップ：{summary}（祝日カレンダー）")
                continue

            try:
                events_result = (
                    service.events()
                    .list(
                        calendarId=calendar_id,
                        timeMin=time_min,
                        timeMax=time_max,
                        maxResults=100,
                        singleEvents=True,
                        orderBy="startTime",
                    )
                    .execute()
                )
                events = events_result.get("items", [])
                for event in events:
                    start = event["start"].get("dateTime", event["start"].get("date"))
                    title = event.get("summary", "（タイトルなし）")
                    all_events.append((start, title))

            except Exception as e:
                print(f"{calendar_id} の取得でエラー: {e}")

        all_events.sort(key=lambda x: x[0])

        if not all_events:
            print("予定は見つかりませんでした。")
            return []

        result = []
        for idx, (start, summary) in enumerate(all_events):
            print(f"{idx}: {start} {summary}")
            result.append({
                "index": idx,
                "start": start,
                "summary": summary,
            })

        return result

    except HttpError as error:
        print(f"Google API エラー: {error}")
        return []
