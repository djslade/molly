package main

import (
	"fmt"
	"net/url"

	"github.com/djslade/molly/molly-scraper/internal/scraper"
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

		recipeHTML, err := scraper.GetDocument(recipeURL)
		if err != nil {
			fmt.Println(err)
			continue
		}

		// Get recipe title
		recipeTitle := scraper.FindSelectionFromDocument(recipeHTML, cfg.selectorsMap[host].Title)
		fmt.Println(recipeTitle)
	}
}
