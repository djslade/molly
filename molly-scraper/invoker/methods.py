from .invoker import Invoker
import grpc
from protoc import RecipesServiceStub

def new_invoker() -> Invoker:
    grpc_channel = grpc.insecure_channel("localhost:8080")
    stub = RecipesServiceStub(grpc_channel)
    invoker = Invoker(stub=stub)
    return invoker