import regex as re

class Formatter:
    def _get_timers(self, text:str) -> list:
        try:    
            timer_rx = r"(\d+).+(min|sec|hour)"
            sentences = text.split(". ")
            matches = []
            for sentence in sentences:
                sentence_matches = re.findall(timer_rx, sentence, re.IGNORECASE)
                matches.extend(sentence_matches)
            return list(filter(lambda x: x[0] != "0", matches))
        except Exception as err:
            print(err)
            return []


    def _abbreviated_recipe(self, text:str) -> bool:
        try:
            return text.upper() == "(ABBREVIATED RECIPE)"
        except Exception as err:
            print(err)
            return False
    

    def _skippable_step(self, text:str) -> bool:
        try:
            skippable_rx =r"[\(\[\{\<].*?[\)\]\}\>]"
            return re.fullmatch(skippable_rx, text) != None
        except Exception as err:
            print(err)
            return False
    
    
    def _remove_rx_matches(self, pattern:str, text:str):
        try:
            cleaned = text
            matches = re.findall(pattern, cleaned)
            for match in matches:
                cleaned = cleaned.replace(match, "")
            return cleaned
        except Exception as err:
            return text
    

    def _remove_price_info(self, text:str) -> str:
        try:
            price_info_rx = r"\([\p{Sc}][^)]+\)"
            return self._remove_rx_matches(price_info_rx, text)
        except Exception as err:
            print(err)
            return text


    def _is_optional(self, text:str) -> bool:
        try:
            optional_rx = r"optional"
            matches = re.findall(optional_rx, text, re.IGNORECASE)
            return len(matches) > 0
        except Exception as err:
            print(err)
            return False

    
    def _clean_text(self, text:str) -> str:
        try:
            text = self._remove_price_info(text)
            text = text.strip()
            return text
        except Exception as err:
            print(err)
            return text
    
    
    def format(self, raw_data:list) -> list:
        try:
           raise Exception("should be implemented")
        except Exception as err:
            print(err)
            return raw_data
