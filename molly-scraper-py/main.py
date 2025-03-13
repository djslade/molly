from scraper import Scraper

def main():
    print("Hi banana!")

    program_running = True

    while program_running:
        recipe_url = input("Enter a URL: ")
        try:
            scraper = Scraper(recipe_url)
            print(scraper.recipe().title())
            print(scraper.recipe().cook_time())
            print(scraper.recipe().ingredients())
            print(scraper.recipe().instructions_list())
            print(scraper.recipe().yields())
        except Exception as err:
            print(err)


if __name__ == "__main__":
    main()