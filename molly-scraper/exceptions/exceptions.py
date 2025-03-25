class BadRequestException(Exception):
    def __init__(self):
        super().__init__(self, "Invalid scrape request")


class BadRecipeException(Exception):
    def __init__(self):
        super().__init__(self, "Invalid recipe data")