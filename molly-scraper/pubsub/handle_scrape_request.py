from helpers import get_recipe_url
from recipe import new_recipe
from invoker import new_invoker
from pubsub import Acker, Publisher
from writer import body_to_str
from pika.channel import Channel
from pika.spec import Basic, BasicProperties

def handle_scrape_request(channel:Channel, method:Basic.Deliver, _:BasicProperties, body:bytes) -> None:
    publisher = Publisher(channel=channel, key="scraper.results")
    acker = Acker(channel=channel, method=method)
    try:
        recipe_url = get_recipe_url(body)
    except Exception:
        publisher.publish(body=body_to_str(url="", status="Malformed scrape request"))
        acker.discard()
    else:
        try:
            recipe = new_recipe(recipe_url)
            invoker = new_invoker()
            res = invoker.create_recipe(recipe.grpc_create_recipe_request())
            publisher.publish(body_to_str(res))
            acker.ack()
        except Exception as err:
            print(err)
            publisher.publish(body_to_str(url=recipe_url, status="internal service error"))
            acker.discard()