from recipe import Recipe
from scraper import Scraper
from formatters import to_instructions, to_ingredients
from invoker import Invoker
import grpc
from protoc import RecipesServiceStub
import json
import exceptions
import os


def _set_optional_field(fn, fallback):
    try:
        return fn()
    except:
        return fallback


def new_recipe(url:str) -> Recipe:
    try:
        scraper = Scraper(url)
        ingredients = to_ingredients(scraper.recipe().ingredient_groups())
        instructions = to_instructions(scraper.recipe().instructions_list())
        recipe = Recipe(
            recipe_url=url,
            title=scraper.recipe().title(),
            description=_set_optional_field(scraper.recipe().description, ""),
            cuisine=_set_optional_field(scraper.recipe().cuisine, ""),
            cooking_method=_set_optional_field(scraper.recipe().cooking_method, ""),
            category=_set_optional_field(scraper.recipe().category, ""),
            image_url=_set_optional_field(scraper.recipe().image, ""),
            yields=_set_optional_field(scraper.recipe().yields, ""),
            prep_time_minutes=_set_optional_field(scraper.recipe().prep_time, 0),
            cook_time_minutes=_set_optional_field(scraper.recipe().cook_time, 0),
            total_time_minutes=_set_optional_field(scraper.recipe().total_time, 0),
            ingredients=ingredients, 
            instructions=instructions
        )
        return recipe
    except Exception as err:
        print(err)
        raise exceptions.BadRecipeException


def new_invoker() -> Invoker:
    conn = os.getenv("RECIPES_CONN")
    if conn == "":
        conn = "localhost:8080"
    grpc_channel = grpc.insecure_channel(conn)
    stub = RecipesServiceStub(grpc_channel)
    invoker = Invoker(stub=stub)
    return invoker


def get_recipe_url(body: bytes) -> str:
    try:
        json_body = json.loads(body)
        recipe_url = json_body["data"]["recipe_url"]
        if recipe_url == "" or recipe_url == None:
            raise Exception
        return recipe_url
    except:
        raise exceptions.BadRequestException