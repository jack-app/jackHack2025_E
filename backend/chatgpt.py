import openai
import os
from dotenv import load_dotenv
import re

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

# 取得した理由の候補をリストに変換
txt=res_1.choices[0].message.content
reasons = re.findall(r"\d+\.\s*(.+)", txt)

print(txt)

usr_reason = str(input("予定を断るための理由を選択してください："))
m=None

date=input("代替日を入力してください：")
if date != "":
    m={
            "role":"system",
            "content":f"キャンセルする予定に対する代替日として{date}を提案してください。"
    }

message=[
        {
            "role": "system",
            "content": "日本語で返答してください。",
        },
        {
            "role": "system",
            "content": f"{usr_schedule}を,{usr_reason}を理由に断るビジネスメール風の文章を出力してください。",
        },
    ]
if  not (m is None):{
    message.append(m)
}
    
res_2 = openai.chat.completions.create(
    model="gpt-4o-mini",
    messages=message
)

print(res_2.choices[0].message.content)
