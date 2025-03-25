from recipe import Ingredient
from ingredient_parser import parse_ingredient
from .helpers import _is_optional
from dataclasses import dataclass

@dataclass
class _RawIngredient:
    text:str
    group:str


def _get_raw_ingredients(raw_data:list) -> list[_RawIngredient]:
    full_ingredients:list[_RawIngredient] = []
    for group in raw_data:
        for i in group.ingredients:
            full_ingredients.append(_RawIngredient(
                text=i,
                group=group.purpose
            ))
    return full_ingredients


def _set_ingredient_name(parsed):
    try:
        foundation_food = parsed.foundation_foods[0].text
        if foundation_food == "":
            raise Exception
        return foundation_food
    except:
        try:
            return parsed.name[0].text
        except:
            return ""


def _set_ingredient_quantity_string(parsed) -> str:
    try:
        return parsed.amount[0].quantity,
    except:
        return ""


def _set_ingredient_quantity(parsed) -> float:
    try:
        quantity = _set_ingredient_quantity_string(parsed)
        if quantity == "":
            raise Exception
        return float(quantity)
    except:
        return 0


def _set_ingredient_unit(parsed) -> str:
    try:
        unit = parsed.amount[0].unit
        return str(unit)
    except:
        return ""


def _set_ingredient_size(parsed) -> str:
    try:
        return parsed.size.text
    except:
        return ""


def _format_ingredient(raw_ingredient:_RawIngredient) -> Ingredient:
    parsed = parse_ingredient(raw_ingredient.text)
    ingredient = Ingredient(
        full_text=raw_ingredient.text,
        is_optional=_is_optional(raw_ingredient.text),
        name=_set_ingredient_name(parsed),
        quantity=_set_ingredient_quantity(parsed),
        quantity_string=_set_ingredient_quantity_string(parsed),
        unit=_set_ingredient_unit(parsed),
        size=_set_ingredient_size(parsed),
        group=raw_ingredient.group
    )
    return ingredient


def to_ingredients(raw_data:list[str]) -> list[Ingredient]:
    full_ingredients = _get_raw_ingredients(raw_data=raw_data)
    return [_format_ingredient(ing) for ing in full_ingredients]