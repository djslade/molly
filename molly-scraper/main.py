from scraper.scraper import Scraper
from recipe.recipe import Recipe
from formatters.ingredient_formatter import IngredientFormatter
from formatters.instruction_formatter import InstructionFormatter
from poster.poster import Poster
from pubsub.pubsub import Pubsub
import json
from pika.channel import Channel
from pika.spec import Basic, BasicProperties


def handle_scrape_request(channel:Channel, method:Basic.Deliver, properties:BasicProperties, body:bytes) -> None:
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
            recipe = Recipe(
                recipe_scraper=scraper.recipe(), 
                title=title, 
                recipe_url=recipe_url, 
                ingredients=ingredients, 
                instructions=instructions
            )
            if not Poster().post_successful(recipe.json()):
                raise Exception("could not save url to database")
            response = {
                "recipe_url": recipe_url,
                "status": "success"
            }
            channel.basic_publish(exchange="", routing_key="scraper.results", body=json.dumps(response))
            channel.basic_ack(delivery_tag=method.delivery_tag)
        except Exception as err:
            print(err)
            response = {
                "recipe_url": recipe_url,
                "status": "failed"
            }
            channel.basic_publish(exchange="", routing_key="scraper.results", body=json.dumps(response))
            channel.basic_nack(delivery_tag=method.delivery_tag, requeue=False)


def main():
    try:
        ps = Pubsub()
        print("Connection to message broker established")
        ps.declare_channel(queue_name="scraper.requests")
        ps.declare_channel(queue_name="scraper.results")
        ps.consume(queue_name="scraper.requests", callback=handle_scrape_request)
    except Exception as err:
        print(f"Failed to establish connection to message broker: {err}")



if __name__ == "__main__":
    main()