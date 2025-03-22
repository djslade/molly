import json

def get_recipe_url(body: bytes) -> str:
    json_body = json.loads(body)
    recipe_url = json_body["data"]["url"]
    return recipe_url