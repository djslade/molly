package main

import (
	"fmt"
	"net/url"

	"github.com/djslade/molly/molly-scraper/internal/selectors"
)

func getURLHost(rawURL string) (string, error) {
	parsed, err := url.Parse(rawURL)
	if err != nil {
		return "", err
	}

	return parsed.Hostname(), nil
}

func main() {
	cfg := config{
		selectorsMap: selectors.NewSelectorMap(),
	}

	fmt.Println("Starting Scraper...")

	for {
		fmt.Print("Enter a recipe URL: ")
		var recipeURL string

		fmt.Scanln(&recipeURL)

		host, err := getURLHost(recipeURL)
		if err != nil {
			fmt.Println("Could not parse URL")
			fmt.Println(err)
			continue
		}

		fmt.Println(host)

		if !cfg.IsScrapable(host) {
			fmt.Println("This website cannot be scraped")
			continue
		}

		fmt.Println("Ready to scrape!")

		recipe, err := cfg.scrapeRecipe(recipeURL, host)
		if err != nil {
			fmt.Println(err)
			continue
		}

		fmt.Printf("%+v", recipe)
	}
}
