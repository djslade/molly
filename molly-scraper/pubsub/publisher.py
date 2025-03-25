from pika.channel import Channel
import json

class Publisher():
    def __init__(self, channel:Channel, queue:str, exchange:str=""):
        self.__channel:Channel = channel
        self.__queue:str = queue
        self.__exchange:str = exchange
    

    def publish(self, body:dict):
        self.__channel.basic_publish(
            exchange=self.__exchange, 
            routing_key=self.__queue, 
            body=json.dumps(body)
        )