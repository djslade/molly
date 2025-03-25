from pubsub import Acker, Publisher, PublishBody
from pika.channel import Channel
from pika.spec import Basic, BasicProperties
from .methods import new_invoker, new_recipe, get_recipe_url
import exceptions
import traceback


def handle_scrape_request(channel:Channel, method:Basic.Deliver, _:BasicProperties, body:bytes) -> None:
    publisher = Publisher(channel=channel, queue="scraper.results")
    acker = Acker(channel=channel, method=method)
    invoker = new_invoker()
    try:
        recipe_url = get_recipe_url(body)
        recipe = new_recipe(recipe_url)
        res_code = invoker.create_recipe(recipe.grpc())
        rk = f"scraper.results.{res_code}"
        publisher.publish(body=PublishBody(patter=rk, url=recipe_url))
        acker.ack()
    except exceptions.BadRequestException:
        rk = "scraper.results.invalid"
        publisher.publish(body=PublishBody(pattern=rk, url=recipe_url))
        acker.discard()
    except exceptions.BadRecipeException:
        rk = "scraper.results.fail"
        publisher.publish(body=PublishBody(pattern=rk, url=recipe_url))
        acker.discard()
    except Exception as err:
        print(err)
        print(traceback.format_exc())
        rk = "scraper.results.unknown"
        publisher.publish(body=PublishBody(pattern=rk, url=recipe_url))
        acker.discard()