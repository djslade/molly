package selectors

type Selectors struct {
	Title               string
	IngredientsFull     string
	IngredientsQuantity string
	IngredientsUnit     string
	IngredientsName     string
	Steps               string
}

var (
	BudgetbytesSelectors Selectors = Selectors{
		Title:               `h1.entry-title`,
		IngredientsFull:     `li.wprm-recipe-ingredient`,
		IngredientsQuantity: `span.wprm-recipe-ingredient-amount`,
		IngredientsUnit:     `span.wprm-recipe-ingredient-unit`,
		IngredientsName:     `span.wprm-recipe-ingredient-name`,
		Steps:               `li.wprm-recipe-instruction`,
	}

	AllrecipesSelectors Selectors = Selectors{
		Title:               `h1.article-heading-text-headline-400`,
		IngredientsFull:     `li.mm-recipes-structured-ingredients__list-item`,
		IngredientsQuantity: `data-ingredients-quantity="true"`,
		IngredientsUnit:     `data-ingredients-unit="true"`,
		IngredientsName:     `data-ingredients-name="true"`,
		Steps:               `comp mntl-sc-block mntl-sc-block-startgroup mntl-sc-block-group--LI`,
	}
)
