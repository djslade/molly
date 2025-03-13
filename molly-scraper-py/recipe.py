import math, json

class Recipe:
    def __init__(self):
        self.__title = None
        self.__description = None
        self.__prep_time = None
        self.__prep_time_formatted = None
        self.__cook_time = None
        self.__cook_time_formatted = None
        self.__total_time = None
        self.__total_time_formatted = None
        self.__yields = None
        self.__ingredients = []
        self.__instructions = []
    
    def __format_time(self, time_in_minutes):
        minutes = time_in_minutes % 60
        hours = math.floor(minutes, 60)
        if hours == 1:
            return "{hours} hour {minutes} minutes"
        if hours > 1:
            return "{hours} hours {minutes} minutes"
        return "{minutes} minutes"

    def title(self):
        return self.__title
        
    def title(self, text):
        self.__title = text
        
    def description(self):
        return self.__description
        
    def description(self, description):
        self.__description = description

    def prep_time(self):
        return self.__prep_time
    
    def prep_time(self, time):
        self.__prep_time = time
        self.__prep_time_formatted = self.__format_time(time)
    
    def prep_time_formatted(self):
        return self.__prep_time_formatted
    
    def cook_time(self):
        return self.__cook_time
    
    def cook_time(self, time):
        self.__cook_time = time
        self.__cook_time_formatted = self.__format_time(time)
    
    def cook_time_formatted(self):
        return self.__cook_time_formatted
    
    def total_time(self):
        return self.__total_time
    
    def total_time(self, time):
        self.__total_time = time
        self.__total_time_formatted = self.__format_time(time)
    
    def total_time_formatted(self):
        return self.__total_time_formatted
    
    def yields(self):
        return self.__yields
    
    def yields(self, yields):
        self.__yields = yields

    def ingredients(self):
        return self.__ingredients
    
    def ingredients(self, ingredients):
        self.__ingredients = ingredients
    
    def instructions(self):
        return self.__instructions
    
    def instructions(self, instructions):
        self.__instructions = instructions

    def json(self):
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
        }

        return json.dump(data)