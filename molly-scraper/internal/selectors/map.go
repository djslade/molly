package selectors

func NewSelectorMap() map[string]Selectors {
	sm := map[string]Selectors{
		"www.budgetbytes.com": BudgetbytesSelectors,
		"www.allrecipes.com":  AllrecipesSelectors,
	}

	return sm
}
