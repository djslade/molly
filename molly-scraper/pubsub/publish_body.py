from dataclasses import dataclass
import json

@dataclass
class PublishBody:
    pattern: str
    url:str=""


    def to_string(self):
        data = {
            "pattern": self.pattern,
            "data": {
                "url": self.url
            }
        }
        return json.dumps(data)