import openai
import os
from dotenv import load_dotenv
from google_calendar import google_calendar_next_month_exclude_holidays
from feedback import feedback

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

    # print(res.choices[0].message.content)

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

def get_cancel_reason_list(schedule: str) -> List[str]:
    """
    任意の予定（文字列）に対して、その予定を断る理由の候補を10個返す。
    """
    res = openai.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {"role": "system", "content": "日本語で返答してください。"},
            {"role": "system", "content": "以下の予定に対して、キャンセル理由の候補を10個挙げてください（単語・箇条書き）。"},
            {"role": "user", "content": schedule},
        ],
    )

    raw = res.choices[0].message.content.strip()
    print("GPTの出力内容:\n", raw)

    lines = [line.strip() for line in raw.splitlines() if line.strip()]
    return [line.lstrip("-0123456789. ").strip() for line in lines]

# import openai
# import os
# from dotenv import load_dotenv
# import re
# import feedback

# load_dotenv()

# openai.api_key = os.getenv("API_KEY")

# usr_schedule = str(input("キャンセルしたい予定を入力してください："))

# res_1 = openai.chat.completions.create(
#     model="gpt-4o-mini",
#     messages=[
#         {
#             "role": "system",
#             "content": "日本語で返答してください。",
#         },
#         {
#             "role": "system",
#             "content": "以下で与えられる予定に対してキャンセルする理由の候補を10個ほど考えて、箇条書きで単語で出力してください。例： 1.体調不良 \n 2.急用 \n ...",
#         },
#         {
#             "role": "user",
#             "content": usr_schedule,
#         },
#     ],
# )

# usr_aite = str(input("言い訳を行う相手を入力してください。必要であれば以下のオプションを利用してください。:\n1.上司\n2.友達\n3.恋人\n4.同僚\n5.先輩"))

# # 取得した理由の候補をリストに変換
# txt = res_1.choices[0].message.content
# reasons = re.findall(r"\d+\.\s*(.+)", txt)

# print(txt)

# usr_reason = str(input("予定を断るための理由を選択してください："))
# m = None

# message=[
#         {
#             "role": "system",
#             "content": "日本語で返答してください。",
#         },
#         {
#             "role": "system",
#             "content":"言い訳の中身だけを出力しなさい。鍵かっこや、こうしたらどうでしょうかのような文言は不要です"
#         },
#         {
#             "role": "system",
#             "content": f"{usr_schedule}を,{usr_reason}を理由に断る文章を出力してください。",
#         },
#     ]

# date=input("代替日を入力してください：")
# if date != "":
#     message.append({
#             "role":"system",
#             "content":f"キャンセルする予定に対する代替日として{date}を提案してください。"
#     })

# while True:  # 整数で入力されていない場合は受け付けない
#     usr_taido = tuple(
#         input(
#             "どのような態度の言い訳の文章がより望ましいか、以下のオプションの中から当てはまるだけ複数選択してください。\n1.丁寧\n2.カジュアル\n3.申し訳なさ強め\n4.ややおびえる感じ\n5.すごく反省している感じ\n6.まったく反省していない感じ\n7.傲慢で見下す感じ\n:"
#         ).split()
#     )
#     for int_str in usr_taido:
#         if int_str.isdigit() == False:
#             print("整数で入力してください。")
#             break
#     else:
#         int_usr_taido = tuple([int(i)-1 for i in usr_taido])
#         break

# message.append({
#     "role":"system",
#     "content":feedback.feedback(usr_aite,*int_usr_taido)
# })

# res = openai.chat.completions.create(
#     model="gpt-4o-mini",
#     messages=message,
# )

# print(res.choices[0].message.content)

# 態度キーワードとインデックス対応
ATTITUDE_MAP = {
    "丁寧": 0,
    "カジュアル": 1,
    "申し訳なさ強め": 2,
    "ややおびえる感じ": 3,
    "すごく反省している感じ": 4,
    "まったく反省していない感じ": 5,
    "傲慢で見下す感じ": 6,
}

def rewrite_cancel_message_by_style(
    schedule: str,
    aite: str,
    attitude_keywords: str,
    original_text: str
) -> Dict[str, str]:
    """
    すでに生成されたキャンセル文（original_text）をベースに、
    相手（aite）や態度（attitude_keywords）に応じた自然な文章に書き換える。

    Parameters:
        schedule (str): キャンセルする予定（例："5月10日の打ち合わせ"）
        aite (str): 言い訳の相手（例："上司", "友達"）
        attitude_keywords (str): 態度キーワード（カンマ区切り、例："丁寧,申し訳なさ強め"）
        original_text (str): ChatGPTで先に生成されたビジネスメール文

    Returns:
        dict: {"message": str}
    """

    # 態度をインデックスに変換
    words = [w.strip() for w in attitude_keywords.replace("，", ",").split(",")]
    attitude_indices = [ATTITUDE_MAP[w] for w in words if w in ATTITUDE_MAP]

    if not attitude_indices:
        raise ValueError(f"有効な態度キーワードが指定されていません: {attitude_keywords}")

    # スタイル指示文を生成
    style_prompt = feedback(aite, *attitude_indices)

    # GPTへのプロンプト構成
    messages = [
        {"role": "system", "content": "日本語で返答してください。"},
        {
            "role": "system",
            "content": f"次の文章は、{schedule}を断る内容の文です。相手や態度に合うように自然に書き換えてください。"
        },
        {"role": "user", "content": f"元の文章:\n{original_text}"},
        {"role": "system", "content": style_prompt},
    ]

    # ChatGPT呼び出し
    res = openai.chat.completions.create(
        model="gpt-4o-mini",
        messages=messages,
    )

    return {"message": res.choices[0].message.content}
