from typing import List

class CreateRecipeRequest:
    recipe: Recipe

class Recipe:
    id: str
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
    ingredients: List['Ingredient']
    instructions: List['Instruction']
    created: str

class Ingredient:
    id: str
    recipe_id: str
    full_text: str
    is_optional: bool
    name: str
    quantity: float
    quantity_string: str
    unit: str
    size: str
    created: str

class Instruction:
    id: str
    recipe_id: str
    index: int
    full_text: str
    has_timer: bool
    timers: List['Timer']
    created: str

class Timer:
    id: str
    instruction_id: str
    value: int
    unit: str
    created: str

