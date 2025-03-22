from pubsub import Broker, Subscriber, handle_scrape_request

def main():
    print("Connection to message broker established")
    broker = Broker()
    subscriber = Subscriber(broker.get_channel())
    subscriber.declare_channel(queue_name="scraper.requests")
    subscriber.declare_channel(queue_name="scraper.results")
    print("Listening to scraper.requests queue")
    subscriber.consume(queue_name="scraper.requests", callback=handle_scrape_request)
        



if __name__ == "__main__":
    main()