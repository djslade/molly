import regex as re

def _get_timers(text:str) -> list:
    try:    
        timer_rx = r"(\d+).+(min|sec|hour)"
        sentences = text.split(". ")
        matches = []
        for sentence in sentences:
            sentence_matches = re.findall(timer_rx, sentence, re.IGNORECASE)
            matches.extend(sentence_matches)
        return list(filter(lambda x: x[0] != "0", matches))
    except Exception as err:
        return []


def _abbreviated_recipe(text:str) -> bool:
    try:
        return text.upper() == "(ABBREVIATED RECIPE)"
    except Exception as err:
        print(err)
        return False


def _skippable_step(text:str) -> bool:
    try:
        skippable_rx =r"[\(\[\{\<].*?[\)\]\}\>]"
        if re.fullmatch(skippable_rx, text) != None:
            return True
        if text == text.upper():
            return True
        if len(text.split(" ")) <= 3:
            return True
        return False
    except Exception as err:
        return False


def _remove_rx_matches(pattern:str, text:str):
    try:
        cleaned = text
        matches = re.findall(pattern, cleaned, re.IGNORECASE)
        for match in matches:
            cleaned = cleaned.replace(match, "")
        return cleaned
    except Exception as err:
        return text


def _remove_price_info(text:str) -> str:
    try:
        price_info_rx = r"\([\p{Sc}][^)]+\)"
        return _remove_rx_matches(price_info_rx, text)
    except Exception as err:
        print(err)
        return text


def _is_optional(text:str) -> bool:
    try:
        optional_rx = r"optional"
        matches = re.findall(optional_rx, text, re.IGNORECASE)
        return len(matches) > 0
    except Exception as err:
        print(err)
        return False


def _remove_asterisks(text:str) -> str:
    return text.strip().replace("*", "")


def _remove_trailing_comma(text:str) -> str:
    return text.strip().replace("(, ", "(")


def _remove_trailing_slash(text:str) -> str:
    return text.strip().replace(" /", "")


def _remove_notes(text:str) -> str:
    note_rx = r"note \d+"
    return _remove_rx_matches(note_rx, text)


def _remove_empty_paranthesis(text:str) -> str:
    return text.strip().replace("()", "")


def _add_paranthesis(text:str) -> str:
    counter = 0
    for c in text:
        if c == "(":
            counter += 1
        if c == ")":
            counter -= 1
    stripped = text.strip()
    if counter > 0:
        return stripped + ")"
    if counter < 0:
        return "(" + stripped
    return stripped


def format_ingredient_name(name:str) -> str:
    formatted = name.lower()
    formatted = _remove_price_info(formatted)
    formatted = _remove_asterisks(formatted)
    formatted = _remove_trailing_slash(formatted)
    return formatted


def format_ingredient_text(text:str) -> str:
    formatted = _remove_trailing_comma(text)
    formatted = _remove_notes(formatted)
    formatted = _remove_empty_paranthesis(formatted)
    formatted = _add_paranthesis(formatted)
    return formatted