import json
import sys

# ── 1. CONFIGURE THESE TWO THINGS ──────────────────────────────────────────────

# Map each markDef key to its footnote number (in order of appearance)
KEY_TO_FN = {
    "13d8a07bbc92": 1,
    "6360ff4c17ce": 2,
    # ... add all your keys here
}

# The footnote texts, numbered from 1
FOOTNOTES = {
    1: 'Edmund Gettier, "Is Justified True Belief Knowledge?" Analysis, 23 (1963), 21–23.',
    2: 'Lehrer, Keith, and Thomas Paxson. "Knowledge: Undefeated Justified True Belief". ...',
    # ... add all your footnote texts here
}

# ── 2. SCRIPT (no changes needed below) ────────────────────────────────────────


def make_fn_content(key, fn_num):
    return [
        {
            "_key": f"fn_block_{key}",
            "_type": "block",
            "children": [{"_key": f"fn_span_{key}", "_type": "span", "marks": [], "text": FOOTNOTES[fn_num]}],
            "markDefs": [],
            "style": "normal"
        }
    ]


def fill_footnotes(data):
    """Recursively walk the document and fill in any empty footnote markDefs."""
    if isinstance(data, list):
        return [fill_footnotes(item) for item in data]
    if isinstance(data, dict):
        if data.get("_type") == "footnote" and "content" not in data:
            key = data["_key"]
            if key in KEY_TO_FN:
                data["content"] = make_fn_content(key, KEY_TO_FN[key])
        return {k: fill_footnotes(v) for k, v in data.items()}
    return data


if __name__ == "__main__":
    input_file = sys.argv[1]                          # e.g. article.json
    output_file = sys.argv[2] if len(
        sys.argv) > 2 else input_file.replace(".json", "_filled.json")

    with open(input_file, encoding="utf-8") as f:
        doc = json.load(f)

    filled = fill_footnotes(doc)

    with open(output_file, "w", encoding="utf-8") as f:
        json.dump(filled, f, ensure_ascii=False, separators=(",", ":"))

    print(f"Done → {output_file}")
