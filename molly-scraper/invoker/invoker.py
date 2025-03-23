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
                return "Bad request"
            case grpc.StatusCode.INTERNAL:
                print(error.details())
                return "Internal server error"
            case grpc.StatusCode.NOT_FOUND:
                return "Not found"
            case grpc.StatusCode.UNAVAILABLE:
                return "Recipe server unavailable"
        return "Internal server error"
    

    def create_recipe(self, req:CreateRecipeRequest) -> str:
        try:
            self.__stub.CreateRecipe(req)
            return "OK"
        except grpc.RpcError as err:
            return self.__handle_grpc_error(err)
