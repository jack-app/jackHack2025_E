import openai
import os
from dotenv import load_dotenv

load_dotenv()

openai.api_key = os.getenv("API_KEY")

usr_schedule = str(input("キャンセルしたい予定を入力してください："))

res_1 = openai.chat.completions.create(
    model="gpt-4o-mini",
    messages=[
        {
            "role": "system",
            "content": "日本語で返答してください。",
        },
        {
            "role": "system",
            "content": "以下で与えられる予定に対してキャンセルする理由の候補を10個ほど考えて、箇条書きで単語で出力してください。例： 1.体調不良 \n 2.急用 \n ...",
        },
        {
            "role": "user",
            "content": usr_schedule,
        },
    ],
)

print(res_1.choices[0].message.content)

usr_reason = str(input("予定を断るための理由を選択してください："))

res_2 = openai.chat.completions.create(
    model="gpt-4o-mini",
    messages=[
        {
            "role": "system",
            "content": "日本語で返答してください。",
        },
        {
            "role": "system",
            "content": f"{usr_schedule}を,{usr_reason}を理由に断るビジネスメール風の文章を出力してください。",
        },
    ],
)

print(res_2.choices[0].message.content)
