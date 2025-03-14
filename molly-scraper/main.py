from scraper import Scraper
from parser import Parser
from recipe import Recipe

def main():
    print("Hi banana!")

    program_running = True

    parser = Parser()

    while program_running:
        recipe_url = input("Enter a URL: ")
        try:
            scraper = Scraper(recipe_url)
            recipe = Recipe()
            
            recipe.title(scraper.recipe().title())
            
            recipe.description(scraper.recipe().description())

            recipe.yields(scraper.recipe().yields())

            recipe.prep_time(scraper.recipe().prep_time())
            recipe.cook_time(scraper.recipe().cook_time())
            recipe.total_time(scraper.recipe().total_time())


            recipe.ingredients(parser.parse_ingredients(scraper.recipe().ingredients()))

            recipe.instructions(parser.parse_instructions(scraper.recipe().instructions_list()))

            print(recipe.json())
        except Exception as err:
            print(err)


if __name__ == "__main__":
    main()