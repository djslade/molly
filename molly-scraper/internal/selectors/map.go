package selectors

func NewSelectorMap() map[string]Selectors {
	sm := map[string]Selectors{
		"www.budgetbytes.com":    BudgetbytesSelectors,
		"budgetbytes.com":        BudgetbytesSelectors,
		"www.allrecipes.com":     AllrecipesSelectors,
		"allrecipes.com":         AllrecipesSelectors,
		"www.pinchofyum.com":     PinceOfYumSelectors,
		"pinchofyum.com":         PinceOfYumSelectors,
		"smittenkitchen.com":     SmittenKitchenSelectors,
		"www.smittenkitchen.com": SmittenKitchenSelectors,
	}

	return sm
}
