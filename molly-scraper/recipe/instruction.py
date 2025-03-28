from dataclasses import dataclass
from .recipe_model import RecipeModel
from .timer import Timer
from protoc import Instruction as CRInstruction

@dataclass
class Instruction(RecipeModel):
    full_text: str
    index: int
    has_timer: bool
    timers: list[Timer]


    def json(self) -> dict:
        data = {
            "full_text": self.full_text,
            "index": self.index,
            "has_timer": self.has_timer,
            "timers": [timer.json() for timer in self.timers]
        }
        return data
    

    def grpc(self) -> CRInstruction:
        return CRInstruction(
            full_text=self.full_text,
            index=self.index,
            has_timer=self.has_timer,
            timers=[timer.grpc() for timer in self.timers]
        )
