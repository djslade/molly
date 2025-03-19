import requests, json

class Poster:
    def post(self, body:str) -> requests.Response:
        response = requests.post(
            url=f"http://localhost:8080/recipes", 
            json=json.loads(body)
        )
        return response
    
    def post_successful(self, body:str) -> bool:
        res = self.post(body)
        return res.status_code == 201