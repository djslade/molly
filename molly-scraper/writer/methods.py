import json

def __new_body(url: str, status: str) -> dict:
    return {
        "pattern": "scraper.results",
        "data": {
            "url": url,
            "status": status
        }
    }


def body_to_str(url: str, status: str) -> dict:
    return json.dumps(__new_body(url, status))