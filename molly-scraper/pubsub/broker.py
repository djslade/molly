import pika, os
from pika.adapters.blocking_connection import BlockingChannel

class Broker():
    def __init__(self):
        self.__user = os.getenv("RABBITMQ_USER", "guest")
        self.__password = os.getenv("RABBITMQ_PASSWORD", "guest")
        self.__host = os.getenv("RABBITMQ_HOST", "localhost")
        self.__port = int(os.getenv("RABBITMQ_PORT", 5672))
        self.__connection = None
        self.__channel = None
        self.__connect()
    

    def __connect(self):
        credentials = pika.PlainCredentials(self.__user, self.__password)
        parameters = pika.ConnectionParameters(host=self.__host, port=self.__port, credentials=credentials)
        self.__connection = pika.BlockingConnection(parameters)
        self.__channel = self.__connection.channel()
    

    def close(self):
        if self.__connection and not self.__connection.is_closed:
            self.__connection.close()
    

    def get_channel(self) -> BlockingChannel:
        return self.__channel
    