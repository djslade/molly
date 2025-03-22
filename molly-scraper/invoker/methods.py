from .invoker import Invoker
import grpc
import recipes_pb2_grpc

def new_invoker() -> Invoker:
    credentials = grpc.ChannelCredentials()
    grpc_channel = grpc.secure_channel("localhost:8080", credentials)
    stub = recipes_pb2_grpc.RecipesServiceStub(grpc_channel)
    creator = Invoker(stub=stub)
    return creator