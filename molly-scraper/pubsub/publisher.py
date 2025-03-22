from pika.channel import Channel

class Publisher():
    def __init__(self, channel:Channel, key:str, exchange:str=""):
        self.__channel:Channel = channel
        self.__key:str = key
        self.__exchange:str = exchange
    

    def publish(self, body:str):
        self.__channel.basic_publish(
            exchange=self.__exchange, 
            routing_key=self.__key, 
            body=body
        )