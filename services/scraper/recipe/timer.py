from dataclasses import dataclass
from .recipe_model import RecipeModel
from protoc import Timer as CRTimer

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
    

    def grpc(self) -> CRTimer:
        return CRTimer(
            value=self.value,
            unit=self.unit
        )