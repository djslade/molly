from ingredient_parser import parse_ingredient
import regex as re
from recipe import Ingredient, Instruction, Timer

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
        print(err)
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
    
        
def _set_manual_fields(raw_ingredient:str, new_ingredient:dict) -> None:
    try:
        new_ingredient["full_text"] = _clean_text (raw_ingredient)
        new_ingredient["is_optional"] = _is_optional(raw_ingredient)
    except Exception as err:
        print(err)


def _set_parsed_fields(raw_ingredient:str, new_ingredient:dict) -> None:
    try:
        pid = parse_ingredient(sentence=raw_ingredient, separate_names=False, foundation_foods=True)
        foundation_food = "" if len(pid.foundation_foods) == 0 else pid.foundation_foods[0].text
        if foundation_food != "":
            new_ingredient["name"] = foundation_food
        else:
            new_ingredient["name"] = "" if len(pid.name) == 0 else pid.name[0].text
        new_ingredient["quantity"] = "" if len(pid.amount) == 0 else str(pid.amount[0].quantity)
        new_ingredient["unit"] = "" if len(pid.amount) == 0 else str(pid.amount[0].unit)
        new_ingredient["size"] = "" if pid.size == None else pid.size.text
    except Exception as err:
        print(err)


def _format_ingredient(raw_ingredient:dict) -> Ingredient:
    new_ingredient = {"group": "" if raw_ingredient["group"] == None else raw_ingredient["group"]}
    _set_manual_fields(raw_ingredient["text"], new_ingredient)
    _set_parsed_fields(raw_ingredient["text"], new_ingredient)
    return new_ingredient


def to_ingredients(raw_data:list) -> list[Ingredient]:
    full_ingredients = []
    for group in raw_data:
        for i in group.ingredients:
            full_ingredients.append({"text": i, "group": group.purpose})
    return [_format_ingredient(ing) for ing in full_ingredients]