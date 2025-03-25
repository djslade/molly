from typing import List

class CreateRecipeRequest:
    recipe_url: str
    title: str
    description: str
    cuisine: str
    cooking_method: str
    category: str
    image_url: str
    yields: str
    prep_time_minutes: int
    cook_time_minutes: int
    total_time_minutes: int
    ingredients: List['CRIngredient']
    instructions: List['CRInstruction']

class CRIngredient:
    full_text: str
    is_optional: bool
    name: str
    quantity: float
    quantity_string: str
    unit: str
    size: str

class CRInstruction:
    index: int
    full_text: str
    has_timer: bool
    timers: List['CRTimer']

class CRTimer:
    value: int
    unit: str

