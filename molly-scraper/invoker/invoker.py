import recipes_pb2
import recipes_pb2_grpc
import grpc

class Invoker:
    def __init__(self, stub:recipes_pb2_grpc.RecipesServiceStub):
        self.__stub:recipes_pb2_grpc.RecipesServiceStub = stub
    
    def __handle_grpc_error(self, error:grpc.RpcError) -> str:
        match error.code():
            case grpc.StatusCode.INVALID_ARGUMENT:
                print("An invalid argument was supplied to the rpc call. This might indicate a problem with the scraper service")
                print(error.details())
                return "Bad request"
            case grpc.StatusCode.INTERNAL:
                print(error.details())
                return "Internal server error"
            case grpc.StatusCode.NOT_FOUND:
                return "Not found"
            case grpc.StatusCode.UNAVAILABLE:
                return "Recipe server unavailable"
        return "Internal server error"
    

    def create_recipe(self, req:recipes_pb2.CreateRecipeRequest) -> str:
        try:
            self.__stub.CreateRecipe(req)
            return "OK"
        except grpc.RpcError as err:
            return self.__handle_grpc_error(err)
