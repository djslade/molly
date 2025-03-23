from .recipe import Recipe
from .exceptions import BadRecipeException
from scraper import Scraper
from formatters import to_instructions, to_ingredients


def _set_optional_field(fn, fallback):
    try:
        return fn()
    except:
        return fallback


def new_recipe(url:str) -> Recipe:
    try:
        scraper = Scraper(url)
        ingredients = to_ingredients(scraper.recipe().ingredient_groups())
        instructions = to_instructions(scraper.recipe().instructions_list())
        recipe = Recipe(
            recipe_url=url,
            title=scraper.recipe().title(),
            description=_set_optional_field(scraper.recipe().description, ""),
            cuisine=_set_optional_field(scraper.recipe().cuisine, ""),
            cooking_method=_set_optional_field(scraper.recipe().cooking_method, ""),
            category=_set_optional_field(scraper.recipe().category, ""),
            image_url=_set_optional_field(scraper.recipe().image, ""),
            yields=_set_optional_field(scraper.recipe().yields, ""),
            prep_time_minutes=_set_optional_field(scraper.recipe().prep_time, 0),
            cook_time_minutes=_set_optional_field(scraper.recipe().cook_time, 0),
            total_time_minutes=_set_optional_field(scraper.recipe().total_time, 0),
            ingredients=ingredients, 
            instructions=instructions
        )
        return recipe
    except:
        raise BadRecipeException
