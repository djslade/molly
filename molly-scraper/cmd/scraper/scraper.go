package main

import (
	"errors"
	"fmt"
	"strings"

	"github.com/djslade/molly/molly-scraper/internal/cleaners"
	"github.com/djslade/molly/molly-scraper/internal/recipes"
	"github.com/djslade/molly/molly-scraper/internal/selectors"
	"github.com/gocolly/colly/v2"
)

func (cfg *config) scrapeRecipe(rawURL string, host string) (recipes.Recipe, error) {
	c := colly.NewCollector(
		colly.AllowedDomains(host),
		colly.IgnoreRobotsTxt(),
	)

	var (
		recipe recipes.Recipe
		tags   selectors.Selectors = cfg.selectorsMap[host]
	)

	c.OnHTML(tags.Title, func(e *colly.HTMLElement) {
		recipe.Title = e.Text
	})

	c.OnHTML(tags.IngredientsFull, func(e *colly.HTMLElement) {
		ingredient := recipes.Ingredient{}

		ingredient.FullText = cleaners.Clean(e.Text)

		if tags.IngredientsQuantity != "" {
			e.ForEach(tags.IngredientsQuantity, func(_ int, ch *colly.HTMLElement) {
				ingredient.Quantity = recipes.ParseQuantity(cleaners.Clean(ch.Text))
			})
		}

		if tags.IngredientsUnit != "" {
			e.ForEach(tags.IngredientsUnit, func(_ int, ch *colly.HTMLElement) {
				ingredient.Unit = recipes.ParseUnit(cleaners.Clean(ch.Text))
			})
		}

		if tags.IngredientsName != "" {
			e.ForEach(tags.IngredientsName, func(_ int, ch *colly.HTMLElement) {
				ingredient.Name = cleaners.Clean(ch.Text)
			})
		}

		ingredient.IsOptional = recipes.ParseIsOptional(e.Text)

		// Add to recipe
		recipe.Ingredients = append(recipe.Ingredients, ingredient)

	})

	c.OnHTML(tags.Steps, func(e *colly.HTMLElement) {
		split := strings.Split(e.Text, "\n")
		for i, st := range split {
			var step recipes.Step
			step.Index = i
			step.Text = cleaners.Clean(st)
			step.HasTimer = recipes.ParseTimerRequired(st)
			recipe.Steps = append(recipe.Steps, step)
		}
	})

	c.OnError(func(r *colly.Response, err error) {
		fmt.Println("Request URL: ", r.Request.URL, "failed with response: ", string(r.Body), "Error: ", err.Error())
	})

	err := c.Visit(rawURL)
	if err != nil {
		return recipes.Recipe{}, err
	}

	if len(recipe.Ingredients) > 0 && len(recipe.Steps) > 0 && recipe.Title != "" {
		return recipe, nil
	}

	fmt.Println(recipe)

	return recipes.Recipe{}, errors.New("could not parse recipe")
}
