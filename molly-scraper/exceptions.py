class InvalidRecipeDataException(Exception):
    def __init__(self, message="The recipe data is invalid"):
        super().__init__(self, message)


class FailedScrapeException(Exception):
    def __init__(self, message=""):
        super().__init__(self, message)
