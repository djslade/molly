class BadRequestException(Exception):
    def __init__(self):
        super().__init__(self, "Invalid scrape request")