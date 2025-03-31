from .helpers import _skippable_step, _abbreviated_recipe, _get_timers
from recipe import Instruction, Timer


def _set_timers(instruction:str) -> list[Timer]:
    timers:list[Timer] = []
    parsed_timers = _get_timers(instruction)
    if len(parsed_timers) == 0:
        return timers
    for timer in parsed_timers:
        new_timer = Timer(
            value=int(timer[0]),
            unit=timer[1]
        )
        timers.append(new_timer)
    return timers


def to_instructions(raw_data:list[str]) -> list[Instruction]:
    parsed_instructions = []
    skip_next = False
    for raw_instruction in raw_data:
        if skip_next:
            skip_next = False
            continue
        if _abbreviated_recipe(raw_instruction):
            skip_next = True
            continue
        if _skippable_step(raw_instruction):
            continue
        timers = _set_timers(raw_instruction)
        new_instruction = Instruction(
            full_text=raw_instruction,
            index=len(parsed_instructions) + 1,
            has_timer=len(timers) > 0,
            timers=timers
        )
        parsed_instructions.append(new_instruction)
    return parsed_instructions