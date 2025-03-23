from recipe import new_recipe, BadRecipeException
from invoker import new_invoker
from pubsub import Acker, Publisher
from pika.channel import Channel
from pika.spec import Basic, BasicProperties
from helpers import get_recipe_url, BadRequestException
from writer import body_to_str

def handle_scrape_request(channel:Channel, method:Basic.Deliver, _:BasicProperties, body:bytes) -> None:
    publisher = Publisher(channel=channel, key="scraper.results")
    acker = Acker(channel=channel, method=method)
    invoker = new_invoker()
    try:
        recipe_url = get_recipe_url(body)
        recipe = new_recipe(recipe_url)
        res = invoker.create_recipe(recipe.grpc_create_recipe_request())
        publisher.publish(body_to_str(res))
        acker.ack()
    except BadRequestException:
        publisher.publish(body=body_to_str(url="", status="bad scrape request"))
        acker.discard()
    except BadRecipeException:
        publisher.publish(body=body_to_str(url="", status="could not scrape recipe"))
    except Exception as err:
        print(err)
        publisher.publish(body_to_str(url=recipe_url, status="Internal service error"))
        acker.discard()