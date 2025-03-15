from scraper import Scraper
from recipe import Recipe
from ingredient_formatter import IngredientFormatter
from instruction_formatter import InstructionFormatter

def main():
    program_running = True

    while program_running:
        recipe_url = input("Enter a URL: ")
        try:
            scraper = Scraper(recipe_url)
            recipe = Recipe(scraper.recipe(), IngredientFormatter(), InstructionFormatter())

            print(recipe.json())
        except Exception as err:
            print(err)


if __name__ == "__main__":
    main()