import grpc
import recipes_pb2
import recipes_pb2_grpc

class Creator:
    def create_recipe(self, stub:recipes_pb2_grpc.RecipesServiceStub, data):
        response = stub.CreateRecipe