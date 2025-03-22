from pika.adapters.blocking_connection import BlockingChannel


class Subscriber():
    def __init__(self, channel:BlockingChannel):
        self.__channel:BlockingChannel = channel


    def declare_channel(self, queue_name:str):
        self.__channel.queue_declare(queue=queue_name, durable=False)


    def consume(self, queue_name:str, callback):
        self.__channel.basic_consume(queue=queue_name, on_message_callback=callback)
        self.__channel.start_consuming()
    