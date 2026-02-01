from pika.channel import Channel
from pika.spec import Basic

class Acker:
    def __init__(self, channel:Channel, method:Basic.Deliver):
        self.__channel:Channel = channel
        self.__method:Basic.Deliver = method
    

    def ack(self):
        self.__channel.basic_ack(delivery_tag=self.__method.delivery_tag)
    

    def requeue(self):
        self.__channel.basic_nack(delivery_tag=self.__method.delivery_tag, requeue=True)

    
    def discard(self):
        self.__channel.basic_nack(delivery_tag=self.__method.delivery_tag, requeue=False)