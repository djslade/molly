class BadRecipeException(Exception):
    def __init__(self):
        super().__init__(self, "Invalid recipe data")