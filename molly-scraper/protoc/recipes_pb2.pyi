from typing import List

class CreateRecipeRequest:
    recipe_url: str
    title: str
    description: str
    cooking_method: str
    category: str
    image_url: str
    prep_time_minutes: int
    prep_time: str
    cook_time_minutes: int
    cook_time: str
    total_time_minutes: int
    total_time: str
    ingredients: List['CRIngredient']
    instructions: List['CRInstruction']

class CRIngredient:
    full_text: str
    is_optional: bool
    name: str
    quantity: str
    unit: str
    size: str

class CRInstruction:
    index: int
    full_text: str
    timers: List['CRTimer']

class CRTimer:
    value: int
    unit: str

