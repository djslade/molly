from .formatter import Formatter

class InstructionFormatter(Formatter):
    def _set_timers(self, instruction:dict, timers:list) -> None:
        try:
            if len(timers) > 0:
                instruction["has_timer"] = True
                instruction["timers"] = []
                for timer in timers:
                    new_timer = {
                        "value": int(timer[0]),
                        "unit": timer[1]
                    }
                    instruction["timers"].append(new_timer)
            else:
                instruction["has_timer"] = False
        except Exception as err:
            print(err)

    
    def format(self, raw_data) -> list:
        try:
            parsed_instructions = []
            skip_next = False
            for raw_instruction in raw_data:
                if skip_next:
                    skip_next = False
                    continue
                if self._abbreviated_recipe(raw_instruction):
                    skip_next = True
                    continue
                if self._skippable_step(raw_instruction):
                    continue
                new_instruction = {}
                new_instruction["index"] = len(parsed_instructions)
                new_instruction["full_text"] = self._clean_text(raw_instruction)
                self._set_timers(new_instruction, self._get_timers(raw_instruction))
                parsed_instructions.append(new_instruction)
            return parsed_instructions
        except Exception as err:
            print(err)
            return []
    