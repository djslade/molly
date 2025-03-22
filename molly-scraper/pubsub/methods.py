from scraper.scraper import Scraper
from recipe.recipe import Recipe
from recipe.new_recipe import new_recipe
from formatters import InstructionFormatter, IngredientFormatter
from creator import new_creator
from pubsub import Acker, Publisher
from pika.channel import Channel
from pika.spec import Basic, BasicProperties
from helpers import get_recipe_url

def handle_scrape_request(channel:Channel, method:Basic.Deliver, _:BasicProperties, body:bytes) -> None:
    publisher = Publisher(channel=channel, key="scraper.results")
    acker = Acker(channel=channel, method=method)
    try:
        recipe_url = get_recipe_url(body)
    except Exception:
        channel.basic_publish(exchange="", )
        acker.discard()
    else:
        try:
            recipe = new_recipe(recipe_url)
            creator = new_creator()
            res = creator.create(recipe.grpc_create_recipe_request())
            publisher.publish(new_body_to_str(res))
            acker.ack()
        except Exception as err:
            print(err)
            publisher.publish(new_body_to_str(url=recipe_url, status="internal service error"))
            acker.discard()