import grpc
from grpc import aio
import asyncio
from protoc import scraper_pb2, scraper_pb2_grpc

class ScraperService(scraper_pb2_grpc.ScraperServiceServicer):
    async def Ping(self, request, context):
        return scraper_pb2.Ping(response=request.greeting)

    async def ScrapeRecipe(self, request, context):
        return scraper_pb2.Recipe()
def main():
    print("Hi banana!")

if __name__ == "__main__":
    main()