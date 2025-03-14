import regex as re

class Parser:
    def _get_timers(self, text:str) -> list:
        timer_rx = r"(\d+).+(minute|second|hour)"
        matches = re.findall(timer_rx, text, re.IGNORECASE, overlapped=True)
        return list(filter(lambda x: x[0] != "0", matches))


    def _abbreviated_recipe(self, text:str) -> bool:
        return text.upper() == "(ABBREVIATED RECIPE)"
    

    def _skippable_step(self, text):
        skippable_rx =r"[\(\[\{\<].*?[\)\]\}\>]"
        return re.fullmatch(skippable_rx, text) != None
    
    
    def _remove_rx_matches(self, pattern, text:str):
        cleaned = text
        matches = re.findall(pattern, cleaned)
        for match in matches:
            cleaned = cleaned.replace(match, "")
        return cleaned
    

    def _remove_price_info(self, text:str):
        price_info_rx = r"\([\p{Sc}][^)]+\)"
        return self._remove_rx_matches(price_info_rx, text)


    def _is_optional(self, text:str) -> bool:
        optional_rx = r"optional"
        matches = re.findall(optional_rx, text, re.IGNORECASE)
        return len(matches) > 0
    
    
    def _clean_text(self, text:str) -> str:
        cleaned = text.strip()
        return cleaned


    def parse_ingredients(self, ingredients:list) -> list[dict]:
        parsed_ingredients = []
        for entry in ingredients:
            new_ingredient = {}
            new_ingredient["full_text"] = self._remove_price_info(entry)
            new_ingredient["is_optional"] = self._is_optional(entry)
            parsed_ingredients.append(new_ingredient)
        return parsed_ingredients

    
    def parse_instructions(self, instructions):
        parsed_instructions = []
        skip_next = False
        for entry in instructions:
            if skip_next:
                skip_next = False
                continue
            if self._abbreviated_recipe(entry):
                skip_next = True
                continue
            if self._skippable_step(entry):
                continue
            new_instruction = {}
            new_instruction["index"] = len(parsed_instructions)
            new_instruction["full_text"] = self._clean_text(entry)
            timers = self._get_timers(entry)
            if len(timers) > 0:
                new_instruction["has_timer"] = True
                new_instruction["timers"] = []
                for timer in timers:
                    new_timer = {
                        "value": int(timer[0]),
                        "unit": timer[1]
                    }
                    new_instruction["timers"].append(new_timer)
            else:
                new_instruction["has_timer"] = False
            parsed_instructions.append(new_instruction)
        return parsed_instructions