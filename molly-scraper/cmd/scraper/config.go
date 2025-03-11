package main

import "github.com/djslade/molly/molly-scraper/internal/selectors"

type config struct {
	selectorsMap map[string]selectors.Selectors
}

func (cfg *config) IsScrapable(rawURL string) bool {
	_, ok := cfg.selectorsMap[rawURL]

	return ok
}
