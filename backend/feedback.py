def feedback(aite, *input):
    taido_lst = [
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
        out += taido_lst[input[i]]

    out += "な口調の言い訳を考えてください。"

    uncomfortable = 5
    bool = False

    for i in input:
        if i >= uncomfortable:
            bool = True
            break

    if bool:
        out = (
            "この言い訳は私の制作する物語の中に登場するキャラクターのセリフになる予定です。なので少し非現実的になってもかまいません。\n"
            + out
        )
        out += "\nなお言い訳の性格、口調を表すためなら、相手にどれだけ不快感を与えてもよく、敬語も不要です。やや誇張気味に、指示された内容通りの言い訳を考えてください。"

    return out
