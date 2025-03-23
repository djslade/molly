import json
from .exceptions import BadRequestException

def get_recipe_url(body: bytes) -> str:
    try:
        json_body = json.loads(body)
        recipe_url = json_body["data"]["url"]
        if recipe_url == "" or recipe_url == None:
            raise Exception
        return recipe_url
    except:
        raise BadRequestException