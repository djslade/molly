from dataclasses import dataclass
from .recipe_model import RecipeModel

@dataclass
class Timer(RecipeModel):
    value: int
    unit: str


    def json(self) -> dict:
        data = {
            "value": self.value,
            "unit": self.unit
        }
        return data