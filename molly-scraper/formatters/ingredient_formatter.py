from .formatter import Formatter
from ingredient_parser import parse_ingredient

class IngredientFormatter(Formatter):

    def _set_manual_fields(self, raw_ingredient:str, new_ingredient:dict) -> None:
        try:
            new_ingredient["full_text"] = self._clean_text (raw_ingredient)
            new_ingredient["is_optional"] = self._is_optional(raw_ingredient)
        except Exception as err:
            print(err)
    

    def _set_parsed_fields(self, raw_ingredient:str, new_ingredient:dict) -> None:
        try:
            pid = parse_ingredient(sentence=raw_ingredient, separate_names=False, foundation_foods=True)
            foundation_food = "" if len(pid.foundation_foods) == 0 else pid.foundation_foods[0].text
            if foundation_food != "":
                new_ingredient["name"] = foundation_food
            else:
                new_ingredient["name"] = "" if len(pid.name) == 0 else pid.name[0].text
            new_ingredient["quantity"] = "" if len(pid.amount) == 0 else str(pid.amount[0].quantity)
            new_ingredient["unit"] = "" if len(pid.amount) == 0 else str(pid.amount[0].unit)
            new_ingredient["size"] = "" if pid.size == None else pid.size.text
        except Exception as err:
            print(err)

    
    def _format_ingredient(self, raw_ingredient:dict) -> dict:
        try:
            new_ingredient = {"group": "" if raw_ingredient["group"] == None else raw_ingredient["group"]}
            self._set_manual_fields(raw_ingredient["text"], new_ingredient)
            self._set_parsed_fields(raw_ingredient["text"], new_ingredient)
            return new_ingredient
        except Exception as err:
            print(err)
            return {}


    def format(self, raw_data:list) -> list:
        try:
            full_ingredients = []
            for group in raw_data:
                for i in group.ingredients:
                    full_ingredients.append({"text": i, "group": group.purpose})
            return [self._format_ingredient(ing) for ing in full_ingredients]
        except Exception as err:
            print(err)
            return []
