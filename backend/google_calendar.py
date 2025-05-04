import datetime
import os.path

from google.auth.transport.requests import Request
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import InstalledAppFlow
from googleapiclient.discovery import build
from googleapiclient.errors import HttpError

SCOPES = ["https://www.googleapis.com/auth/calendar.readonly"]

def google_calendar_all_exclude_holidays():
    """
    すべてのカレンダーから予定を取得し、「祝日」カレンダーに属する予定を除外して表示。
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

        now = datetime.datetime.now(datetime.UTC).isoformat()
        print("全カレンダーから予定を取得中（祝日カレンダーは除外）")

        # カレンダー一覧を取得
        calendar_list = service.calendarList().list().execute()

        # 「祝日」カレンダーIDを収集
        holiday_calendar_ids = []
        for calendar in calendar_list["items"]:
            summary = calendar.get("summary", "")
            if "祝日" in summary or "Holiday" in summary:
                holiday_calendar_ids.append(calendar["id"])

        all_events = []

        for calendar in calendar_list["items"]:
            calendar_id = calendar["id"]
            summary = calendar.get("summary", "")

            # 「祝日」カレンダーはスキップ
            if calendar_id in holiday_calendar_ids:
                print(f"スキップ：{summary}（祝日カレンダー）")
                continue

            try:
                events_result = (
                    service.events()
                    .list(
                        calendarId=calendar_id,
                        timeMin=now,
                        maxResults=10,
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

        # 時間順にソート
        all_events.sort(key=lambda x: x[0])

        if not all_events:
            print("予定は見つかりませんでした。")
            return "予定がありません"

        for start, summary in all_events:
            print(f"{start} {summary}")

        return all_events

    except HttpError as error:
        print(f"Google API エラー: {error}")
        return "APIエラー"

