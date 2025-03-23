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


def _set_field(value, fallback, fb_condition):
    return fallback if fb_condition else value


def _set_ingredient_name(parsed):
    foundation_food = _set_field(
        value=parsed.foundation_foods[0].text,
        fallback="",
        fb_condition=len(parsed.foundation_foods) == 0
    )
    if foundation_food != "":
        return foundation_food
    return _set_field(
        value=parsed.name[0].text,
        fallback="",
        fb_condition=len(parsed.name) == 0
    )


def _set_ingredient_quantity_string(parsed) -> str:
    quantity = _set_field(
        value=parsed.amount[0].quantity,
        fallback="",
        fb_condition=len(parsed.amount) == 0
    )
    return quantity


def _set_ingredient_quantity(parsed) -> float:
    quantity = _set_ingredient_quantity_string(parsed)
    return 0 if quantity == "" else float(quantity)


def _set_ingredient_unit(parsed) -> str:
    unit = _set_field(
        value=parsed.amount[0].unit,
        fallback="",
        fb_condition=len(parsed.amount) == 0
    )
    return unit


def _set_ingredient_size(parsed) -> str:
    size = _set_field(
        value=parsed.size.text,
        fallback="",
        fb_condition=parsed.size == None
    )
    return size


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