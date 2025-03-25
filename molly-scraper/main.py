from pubsub import Broker, Subscriber
from service import handle_scrape_request
import logging

def main():
    broker = Broker()
    print("Connection to message broker established")
    subscriber = Subscriber(broker.get_channel())
    subscriber.declare_channel(queue_name="scraper.requests")
    subscriber.declare_channel(queue_name="scraper.results")
    print("Listening to scraper.requests queue")
    subscriber.consume(queue_name="scraper.requests", callback=handle_scrape_request)
        

if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        logging.warning("Detected keyboard interruption signal")
    finally:
        print("Shutting down...")