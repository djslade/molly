import random, requests
from recipe_scrapers import scrape_html

class Scraper:
    __user_agents = [
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36",
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:124.0) Gecko/20100101 Firefox/124.0",
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36 Edg/123.0.2420.81",
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36 OPR/109.0.0.0",
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36",
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 14.4; rv:124.0) Gecko/20100101 Firefox/124.0",
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 14_4_1) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.4.1 Safari/605.1.15",
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 14_4_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36 OPR/109.0.0.0",
        "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36",
        "Mozilla/5.0 (X11; Linux i686; rv:124.0) Gecko/20100101 Firefox/124.0"
    ]


    def __init__(self, raw_url:str):
        try:
            self.__recipe = self.__scrape_recipe(raw_url)
        except Exception as err:
            print(err)
            raise Exception

    
    def __select_user_agent(self):        
        agent = random.choice(self.__user_agents)
        return agent
    
    
    def __get_headers(self):
        user_agent = self.__select_user_agent()
        return {
            "User-Agent": user_agent
        }
    
    
    def __get_html(self, raw_url:str):
        res = requests.get(raw_url, headers=self.__get_headers())
        html = res.text
        return html
    
    
    def __scrape_recipe(self, raw_url:str):
        html = self.__get_html(raw_url)
        scraper = scrape_html(html, org_url=raw_url)
        return scraper
    
    
    def recipe(self):
        return self.__recipe
