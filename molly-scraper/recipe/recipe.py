from protoc import CreateRecipeRequest, Recipe as CRRecipe
from dataclasses import dataclass
from .recipe_model import RecipeModel
from .ingredient import Ingredient
from .instruction import Instruction

@dataclass
class Recipe(RecipeModel):
    recipe_url: str
    title: str
    description: str
    cuisine: str
    cooking_method: str
    category: str
    image_url: str
    yields: str
    prep_time_minutes: int
    cook_time_minutes: int
    total_time_minutes: int
    ingredients: list[Ingredient]
    instructions: list[Instruction]


    def json(self) -> dict:
        data = {
            "title": self.title,
            "recipe_url": self.recipe_url,
            "description": self.description,
            "cuisine": self.cuisine,
            "cooking_method": self.cooking_method,
            "category": self.category,
            "image_url": self.image_url,
            "yields": self.yields,
            "prep_time_minutes": self.prep_time_minutes,
            "cook_time_minutes": self.cook_time_minutes,
            "total_time_minutes": self.total_time_minutes,
            "ingredients": [ingredient.json() for ingredient in self.ingredients],
            "instructions": [instruction.json() for instruction in self.instructions],
        }
        return data
    
    
    def grpc(self) -> CreateRecipeRequest:
        req_recipe = CRRecipe(
            title=self.title,
            recipe_url=self.recipe_url,
            description=self.description,
            cuisine=self.cuisine,
            cooking_method=self.cooking_method,
            category=self.category,
            image_url=self.image_url,
            yields=self.yields,
            prep_time_minutes=self.prep_time_minutes,
            cook_time_minutes=self.cook_time_minutes,
            total_time_minutes=self.total_time_minutes,
            ingredients=[ingredient.grpc() for ingredient in self.ingredients],
            instructions=[instruction.grpc() for instruction in self.instructions],
        )
        return CreateRecipeRequest(recipe=req_recipe)