from protoc import RecipesServiceStub, CreateRecipeRequest
import grpc

class Invoker:
    def __init__(self, stub:RecipesServiceStub):
        self.__stub:RecipesServiceStub = stub
    
    def __handle_grpc_error(self, error:grpc.RpcError) -> str:
        match error.code():
            case grpc.StatusCode.INVALID_ARGUMENT:
                print("An invalid argument was supplied to the rpc call. This might indicate a problem with the scraper service")
                print(error.details())
                return "internal"
            case grpc.StatusCode.INTERNAL:
                print(error.details())
                return "internal"
            case grpc.StatusCode.NOT_FOUND:
                return "notfound"
            case grpc.StatusCode.UNAVAILABLE:
                return "unavailable"
        return "Internal"
    

    def create_recipe(self, req:CreateRecipeRequest) -> str:
        try:
            self.__stub.CreateRecipe(req)
            return "ok"
        except grpc.RpcError as err:
            return self.__handle_grpc_error(err)
