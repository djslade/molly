import pika, os


class PubSub():
    def __init__(self):
        self.user = os.getenv("RABBITMQ_USER", "guest")
        self.password = os.getenv("RABBITMQ_PASSWORD", "guest")
        self.host = os.getenv("RABBITMQ_HOST", "localhost")
        self.port = int(os.getenv("RABBITMQ_PORT", 5672))
        self.connection = None
        self.channel = None
        self.connect()
    

    def connect(self):
        credentials = pika.PlainCredentials(self.user, self.password)
        parameters = pika.ConnectionParameters(host=self.host, port=self.port, credentials=credentials)
        self.connection = pika.BlockingConnection(parameters)
        self.channel = self.connection.channel()
    

    def close(self):
        if self.connection and not self.connection.is_closed:
            self.connection.close()
    

    def declare_channel(self, queue_name):
        if not self.channel:
            raise Exception("Connection is not established")
        self.channel.queue_declare(queue=queue_name, durable=True)


    def consume(self, queue_name, callback):
        if not self.channel:
            raise Exception("Connection is not established")
        self.channel.basic_consume(queue=queue_name, on_message_callback=callback)
        self.channel.start_consuming()
    