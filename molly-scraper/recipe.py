import json
from recipe_scrapers import AbstractScraper
from formatter import Formatter

class Recipe:
    def __init__(self, scraper:AbstractScraper, ingredient_formatter:Formatter, instruction_formatter:Formatter):
        try:
            self.__init_formatters(ingredient_formatter, instruction_formatter)
            self.__init_fields(scraper)
        except Exception as err:
            print(err)
            self.__title:str = ""
            self.__ingredients:list = []
            self.__instructions:list = []
 
    
    def __init_formatters(self, ingredient_formatter, instruction_formatter) -> None:
        self.__ingredient_formatter:Formatter = ingredient_formatter
        self.__instruction_formatter:Formatter = instruction_formatter   

    
    def __init_fields(self, scraper:AbstractScraper) -> None:
        self.__title:str = self.__set_title(scraper)
        self.__description:str = self.__set_description(scraper)
        self.__cuisine:str = self.__set_cuisine(scraper)
        self.__cooking_method:str = self.__set_cooking_method(scraper)
        self.__category:str = self.__set_category(scraper)
        self.__image_url:str = self.__set_image_url(scraper)
        self.__prep_time:int = self.__set_prep_time(scraper)
        self.__prep_time_formatted:str = self.__format_time(self.__prep_time)
        self.__cook_time:int = self.__set_cook_time(scraper)
        self.__cook_time_formatted:str = self.__format_time(self.__cook_time)
        self.__total_time:int = self.__set_total_time(scraper)
        self.__total_time_formatted:str = self.__format_time(self.__total_time)
        self.__yields:str = self.__set_yields(scraper)
        self.__ingredients:list = self.__set_ingredients(scraper)
        self.__instructions:list = self.__set_instructions(scraper)


    def __format_time(self, time_in_minutes:int) -> str:
        try:
            if time_in_minutes == 0:
                return ""
            minutes = time_in_minutes % 60
            minute_unit = "minute" if minutes == 1 else "minutes"
            hours = time_in_minutes // 60
            hour_unit = "hour" if hours == 1 else "hours"
            if hours > 0:
                return f"{hours} {hour_unit} {minutes} {minute_unit}"
            return f"{minutes} {minute_unit}"
        except Exception as err:
            print(err)
            return ""
        

    def __set_field(self, fn, default_value):
        try:
            return fn()
        except Exception as err:
            print(err)
            return default_value


    
    def __set_title(self, scraper:AbstractScraper) -> str:
        return self.__set_field(scraper.title, "")


    def __set_description(self, scraper:AbstractScraper) -> str:
        return self.__set_field(scraper.description, "")
    

    def __set_cuisine(self, scraper:AbstractScraper) -> str:
        return self.__set_field(scraper.cuisine, "")
        
    
    def __set_cooking_method(self, scraper:AbstractScraper) -> str:
        return self.__set_field(scraper.cooking_method, "")


    def __set_category(self, scraper:AbstractScraper) -> str:
        return self.__set_field(scraper.category, "")
    

    def __set_image_url(self, scraper:AbstractScraper) -> str:
        return self.__set_field(scraper.image, "")

    
    def __set_prep_time(self, scraper:AbstractScraper) -> int:
        return self.__set_field(scraper.prep_time, 0)
    
    
    def __set_cook_time(self, scraper:AbstractScraper) -> int:
        return self.__set_field(scraper.cook_time, 0)
    

    def __set_total_time(self, scraper:AbstractScraper) -> int:
        return self.__set_field(scraper.total_time, 0)

    
    def __set_yields(self, scraper:AbstractScraper) -> str:
        return self.__set_field(scraper.yields, "")
    

    def __set_formatted_field(self, formatter_fn, raw_data_fn, default_value):
        try:
            raw_data = raw_data_fn()
            return formatter_fn(raw_data)
        except Exception as err:
            print(err)
            return default_value
    

    def __set_ingredients(self, scraper:AbstractScraper) -> list:
        return self.__set_formatted_field(self.__ingredient_formatter.format, scraper.ingredients, [])
    

    def __set_instructions(self, scraper:AbstractScraper) -> list:
        return self.__set_formatted_field(self.__instruction_formatter.format, scraper.instructions_list, [])


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
        try:
            if not self.is_valid():
                raise Exception("recipe data is invalid")
            data = {
                "title": self.__title,
                "description": self.__description,
                "cuisine": self.__cuisine,
                "cooking_method": self.__cooking_method,
                "category": self.__category,
                "image_url": self.__image_url,
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
