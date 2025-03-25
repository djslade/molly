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
        return re.fullmatch(skippable_rx, text) != None
    except Exception as err:
        print(err)
        return False


def _remove_rx_matches(pattern:str, text:str):
    try:
        cleaned = text
        matches = re.findall(pattern, cleaned)
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


def _clean_text(text:str) -> str:
    try:
        text = _remove_price_info(text)
        text = text.strip()
        return text
    except Exception as err:
        print(err)
        return text
    