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
    ���ׂẴJ�����_�[����\����擾���A�u�j���v�J�����_�[�ɑ�����\������O���ĕ\���B
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
        print("�S�J�����_�[����\����擾���i�j���J�����_�[�͏��O�j")

        # �J�����_�[�ꗗ���擾
        calendar_list = service.calendarList().list().execute()

        # �u�j���v�J�����_�[ID�����W
        holiday_calendar_ids = []
        for calendar in calendar_list["items"]:
            summary = calendar.get("summary", "")
            if "�j��" in summary or "Holiday" in summary:
                holiday_calendar_ids.append(calendar["id"])

        all_events = []

        for calendar in calendar_list["items"]:
            calendar_id = calendar["id"]
            summary = calendar.get("summary", "")

            # �u�j���v�J�����_�[�̓X�L�b�v
            if calendar_id in holiday_calendar_ids:
                print(f"�X�L�b�v�F{summary}�i�j���J�����_�[�j")
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
                    title = event.get("summary", "�i�^�C�g���Ȃ��j")
                    all_events.append((start, title))

            except Exception as e:
                print(f"{calendar_id} �̎擾�ŃG���[: {e}")

        # ���ԏ��Ƀ\�[�g
        all_events.sort(key=lambda x: x[0])

        if not all_events:
            print("�\��͌�����܂���ł����B")
            return "�\�肪����܂���"

        for start, summary in all_events:
            print(f"{start} {summary}")

        return all_events

    except HttpError as error:
        print(f"Google API �G���[: {error}")
        return "API�G���["

