from recipe import Recipe
from scraper import Scraper
from formatters import IngredientFormatter, InstructionFormatter

def new_recipe(url:str) -> Recipe:
    scraper = Scraper(url)
    title = scraper.recipe().title()
    ingredients = IngredientFormatter().format(scraper.recipe().ingredients())
    instructions = InstructionFormatter().format(scraper.recipe().instructions_list())
    recipe = Recipe(
        recipe_scraper=scraper.recipe(), 
        title=title, 
        recipe_url=url, 
        ingredients=ingredients, 
        instructions=instructions
    )
    return recipe
