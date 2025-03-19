import json
from recipe_scrapers import AbstractScraper
from exceptions import InvalidRecipeDataException

class Recipe:
    def __init__(self, title, ingredients, instructions, recipe_url, recipe_scraper:AbstractScraper):
        try:
            self._init_required_fields(title, recipe_url, ingredients, instructions)
            self._init_optional_fields(recipe_scraper)
        except InvalidRecipeDataException as err:
            raise err
 
    
    def _init_required_fields(self, title:str, recipe_url:str, ingredients:list, instructions:list):
        if title == "":
            raise InvalidRecipeDataException("Recipe is missing a title")
        if recipe_url == "":
            raise InvalidRecipeDataException("Recipe is missing a url")
        if len(ingredients) == 0:
            raise InvalidRecipeDataException("Recipe is missing ingredients")
        if len(instructions) == 0:
            raise InvalidRecipeDataException("Recipe is missing instructions")
        self.__title = title
        self.__recipe_url = recipe_url
        self.__ingredients = ingredients
        self.__instructions = instructions
    

    def _init_optional_fields(self, scraper:AbstractScraper):
        self.__description = self.__set_field(scraper.description, "")
        self.__cuisine = self.__set_field(scraper.cuisine, "")
        self.__cooking_method = self.__set_field(scraper.cooking_method, "")
        self.__category = self.__set_field(scraper.category, "")
        self.__image_url = self.__set_field(scraper.image, "")
        self.__prep_time = self.__set_field(scraper.prep_time, 0)
        self.__cook_time = self.__set_field(scraper.cook_time, 0)
        self.__total_time = self.__set_field(scraper.total_time, 0)
        self.__yields = self.__set_field(scraper.yields, "")


    def _format_time(self, time_in_minutes:int) -> str:
        try:
            if time_in_minutes == 0:
                raise Exception
            minutes = time_in_minutes % 60
            minute_unit = "minute" if minutes == 1 else "minutes"
            hours = time_in_minutes // 60
            hour_unit = "hour" if hours == 1 else "hours"
            if hours > 0:
                return f"{hours} {hour_unit} {minutes} {minute_unit}"
            return f"{minutes} {minute_unit}"
        except Exception as err:
            return ""
        

    def __set_field(self, fn, default_value):
        try:
            return fn()
        except Exception as err:
            return default_value


    def is_valid(self) -> bool:
        try:
            if self.__title == "":
                return False
            if len(self.__ingredients) == 0:
                return False
            if len(self.__instructions) == 0:
                return False
            return True
        except Exception as err:
            print(err)
            return False
    

    def json(self) -> str:
        if not self.is_valid():
            raise Exception("recipe data is invalid")
        data = {
            "title": self.__title,
            "recipe_url": self.__recipe_url,
            "description": self.__description,
            "cuisine": self.__cuisine,
            "cooking_method": self.__cooking_method,
            "category": self.__category,
            "image_url": self.__image_url,
            "yields": self.__yields,
            "prep_time_minutes": self.__prep_time,
            "prep_time": self._format_time(self.__prep_time),
            "cook_time_minutes": self.__cook_time,
            "cook_time": self._format_time(self.__cook_time),
            "total_time_minutes": self.__total_time,
            "total_time": self._format_time(self.__total_time),
            "ingredients": self.__ingredients,
            "instructions": self.__instructions,
        }
        return json.dumps(data)
