from scraper import Scraper
from recipe import Recipe
from ingredient_formatter import IngredientFormatter
from instruction_formatter import InstructionFormatter
from pub_sub import PubSub
import json


def handle_scrape_request(channel, method, properties, body):
    try:
        json_body = json.loads(body)
        recipe_url = json_body["data"]["url"]
    except Exception:
        channel.basic_ack(delivery_tag=method.delivery_tag)
    else:
        try:
            scraper = Scraper(recipe_url)
            title = scraper.recipe().title()
            ingredients = IngredientFormatter().format(scraper.recipe().ingredients())
            instructions = InstructionFormatter().format(scraper.recipe().instructions_list())
            recipe = Recipe(recipe_scraper=scraper.recipe(), title=title, ingredients=ingredients, instructions=instructions)
            print(recipe.json())
            response = {
                "recipe_url": recipe_url,
                "status": "success"
            }
            channel.basic_publish(exchange="", routing_key="scraper_results", body=json.dumps(response))
            channel.basic_ack(delivery_tag=method.delivery_tag)
        except Exception as err:
            print(err)
            response = {
                "recipe_url": recipe_url,
                "status": "failed"
            }
            channel.basic_publish(exchange="", routing_key="scraper_results", body=json.dumps(response))
            channel.basic_ack(delivery_tag=method.delivery_tag)


def main():
    try:
        pubsub = PubSub()
        print("Connection to message broker established")
        pubsub.declare_channel(queue_name="scraper_requests")
        pubsub.declare_channel(queue_name="scraper_results")
        pubsub.consume(queue_name="scraper_requests", callback=handle_scrape_request)
    except Exception as err:
        print(f"Failed to establish connection to message broker: {err}")



if __name__ == "__main__":
    main()