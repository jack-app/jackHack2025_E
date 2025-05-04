import openai
import os
from dotenv import load_dotenv
from google_calendar import google_calendar_next_month_exclude_holidays

load_dotenv()

openai.api_key = os.getenv("API_KEY")
def get_cancel_reason_list(schedule: str) -> list[str]:
    res = openai.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {"role": "system", "content": "日本語で返答してください。"},
            {"role": "system", "content": "以下の予定に対して、キャンセル理由の候補を10個挙げてください（単語・箇条書き）。"},
            {"role": "user", "content": schedule},
        ],
    )
    raw = res.choices[0].message.content.strip()
    lines = [line.strip() for line in raw.splitlines() if "." in line and line[0].isdigit()]
    return [line.split(".", 1)[1].strip() for line in lines]

def generate_cancel_message(schedule: str, reason: str) -> dict:
    res = openai.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {"role": "system", "content": "日本語で返答してください。"},
            {"role": "system", "content": f"{schedule}を{reason}を理由に丁寧に断るビジネスメールを作成してください。"},
        ],
    )
    return {"message": res.choices[0].message.content}

from typing import List
import openai

from typing import List, Dict, Union
import openai

def get_cancel_reasons_by_index(index: int) -> Dict[str, Union[str, List[str]]]:
    """
    Googleカレンダーの予定のうち、指定された index にある予定に対して、
    その予定内容（summary, start）と、キャンセル理由候補を含んだ辞書を返す。
    """
    events = google_calendar_next_month_exclude_holidays()

    if index < 0 or index >= len(events):
        raise IndexError("指定された index の予定が存在しません。")

    target_event = events[index]
    target_summary = target_event["summary"]
    target_start = target_event["start"]

    res = openai.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {"role": "system", "content": "日本語で返答してください。"},
            {"role": "system", "content": "以下の予定に対して、キャンセル理由の候補を10個挙げてください（単語・箇条書き）。"},
            {"role": "user", "content": target_summary},
        ],
    )

    raw = res.choices[0].message.content.strip()
    print("GPTの出力内容:\n", raw)

    lines = [line.strip() for line in raw.splitlines() if line.strip()]
    reasons = [line.lstrip("-0123456789. ").strip() for line in lines]

    return {
        "index": index,
        "start": target_start,
        "summary": target_summary,
        "cancel_reasons": reasons
    }

