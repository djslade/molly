from dataclasses import dataclass
from .recipe_model import RecipeModel
from protoc import CRIngredient

@dataclass
class Ingredient(RecipeModel):
    full_text: str
    is_optional: bool
    name: str
    quantity: float
    quantity_string: str
    unit: str
    size: str
    group: str


    def json(self) -> dict:
        data = {
            "full_text": self.full_text,
            "is_optional": self.is_optional,
            "name": self.name,
            "quantity": self.quantity,
            "quantity_string": self.quantity_string,
            "unit": self.unit,
            "size": self.size,
            "group": self.group
        }
        return data
    

    def grpc(self) -> CRIngredient:
        return CRIngredient(
            full_text=self.full_text,
            is_optional=self.is_optional,
            name=self.name,
            quantity=self.quantity,
            quantity_string=self.quantity_string,
            unit=self.unit,
            size=self.size,
            group=self.group
        )