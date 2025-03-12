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
		Title:               `h2.wprm-recipe-name`,
		IngredientsFull:     `li.wprm-recipe-ingredient`,
		IngredientsQuantity: `span.wprm-recipe-ingredient-amount`,
		IngredientsUnit:     `span.wprm-recipe-ingredient-unit`,
		IngredientsName:     `span.wprm-recipe-ingredient-name`,
		Steps:               `li.wprm-recipe-instruction`,
	}

	AllrecipesSelectors Selectors = Selectors{
		Title:               `h1.article-heading.text-headline-400`,
		IngredientsFull:     `li.mm-recipes-structured-ingredients__list-item`,
		IngredientsQuantity: `span[data-ingredient-quantity="true"]`,
		IngredientsUnit:     `span[data-ingredient-unit="true"]`,
		IngredientsName:     `span[data-ingredient-name="true"]`,
		Steps:               `li.comp.mntl-sc-block.mntl-sc-block-startgroup.mntl-sc-block-group--LI`,
	}

	PinceOfYumSelectors Selectors = Selectors{
		Title:               `h2.tasty-recipes-title`,
		IngredientsFull:     `li[data-tr-ingredient-checkbox]`,
		IngredientsQuantity: `span.nutrifox-quantity`,
		IngredientsUnit:     `span.nutrifox-unit`,
		IngredientsName:     `strong`,
		Steps:               `div.tasty-recipes-instructions>div[data-tasty-recipes-customization="body-color.color"]>ol>li`,
	}
)
