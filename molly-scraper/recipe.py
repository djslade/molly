import math, json
from recipe_scrapers import AbstractScraper

class Recipe:
    def __init__(self, scraper:AbstractScraper):
        try:
            self.__title:str = self.__set_title(scraper)
            self.__description:str = self.__set_description(scraper)
            self.__prep_time:int = self.__set_prep_time(scraper)
            self.__prep_time_formatted:str = self.__format_time(self.__prep_time)
            self.__cook_time:int = self.__set_cook_time(scraper)
            self.__cook_time_formatted:str = self.__format_time(self.__cook_time)
            self.__total_time:int = self.__set_total_time(scraper)
            self.__total_time_formatted:str = self.__format_time(self.__total_time)
            self.__yields:str = self.__set_yields(scraper)
            self.__ingredients:list = self.__set_ingredients(scraper)
            self.__instructions:list = self.__set_instructions(scraper)
        except Exception as err:
            print(err)
            self.__title:str = ""
            self.__ingredients:list = []
            self.__instructions:list = []
    

    def __format_time(self, time_in_minutes:int) -> str:
        try:
            if time_in_minutes == 0:
                return ""
            minutes = time_in_minutes % 60
            minute_unit = "minutes"
            if minutes == 1:
                minute_unit = "minute"
            hours = math.floor(minutes / 60)
            if hours == 1:
                return f"{hours} hour {minutes} {minute_unit}"
            if hours > 1:
                return f"{hours} hours {minutes} {minute_unit}"
            return f"{minutes} {minute_unit}"
        except Exception as err:
            print(err)
            return ""



    
    def __set_title(self, scraper:AbstractScraper) -> str:
        try:
            return scraper.title()
        except Exception as err:
            print(err)
            return ""


    def __set_description(self, scraper:AbstractScraper) -> str:
        try:
            return scraper.description()
        except Exception as err:
            print(err)
            return ""
    
    
    def __set_prep_time(self, scraper:AbstractScraper) -> int:
        try:
            return scraper.prep_time()
        except Exception as err:
            print(err)
            return 0
    
    
    def __set_cook_time(self, scraper:AbstractScraper) -> int:
        try:
            return scraper.cook_time()
        except Exception as err:
            print(err)
            return 0
    

    def __set_total_time(self, scraper:AbstractScraper) -> int:
        try:
            return scraper.total_time()
        except Exception as err:
            print(err)
            return 0

    
    def __set_yields(self, scraper:AbstractScraper) -> str:
        try:
            return scraper.yields()
        except Exception as err:
            print(err)
            return ""
    
    
    def __set_ingredients(self, scraper:AbstractScraper) -> list:
        try:
            return scraper.ingredients()
        except Exception as err:
            print(err)
            return []
    
    
    def __set_instructions(self, scraper:AbstractScraper) -> None:
        try:
            return scraper.instructions_list()
        except Exception as err:
            print(err)
            return []

    
    def is_valid(self) -> bool:
        if self.__title == "":
            return False
        if len(self.__ingredients) == 0:
            return False
        if len(self.__instructions) == 0:
            return False
        return True
    

    def json(self) -> str:
        try:
            if not self.is_valid():
                raise Exception("recipe data is invalid")
            data = {
                "title": self.__title,
                "description": self.__description,
                "yields": self.__yields,
                "prep_time_minutes": self.__prep_time,
                "prep_time": self.__prep_time_formatted,
                "cook_time_minutes": self.__cook_time,
                "cook_time": self.__cook_time_formatted,
                "total_time_minutes": self.__total_time,
                "total_time": self.__total_time_formatted,
                "ingredients": self.__ingredients,
                "instructions": self.__instructions,
            }
            return json.dumps(data)
        except Exception as err:
            print(err)
            return ""
