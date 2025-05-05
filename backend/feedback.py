def feedback(aite, *input):
    A = [
        "丁寧",
        "カジュアル",
        "申し訳なさ強め",
        "ややおびえる感じ",
        "すごく反省している感じ",
        "まったく反省していない感じ",
        "傲慢で見下す感じ",
    ]
    out = ""
    if len(aite) > 0:
        out += aite + "に"

    for i in range(len(input)):
        if i > 0:
            out += "かつ"
        out += A[input[i]]

    out += "な口調の予定をキャンセルする言い訳を考えてください。"

    uncomfortable = 5
    bool = False

    for i in input:
        if i >= uncomfortable:
            bool = True
            break
    out = (
    "この言い訳は私の制作する物語の中に登場するキャラクターのセリフになる予定です。なので言い回しが非現実的になってもかまいませんが言い訳の内容自体は現実に即してください。\n"
    + out
    )
    if bool:
        out += "\nなお言い訳の性格、口調を表すためなら、相手にどれだけ不快感を与えてもよく、敬語も不要です。やや誇張気味に、指示された内容通りの言い訳を考えてください。"

    return out
