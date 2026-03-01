package recipes

type Recipe struct {
	ID               string `json:"id"`
	RecipeURL        string `json:"recipeURL"`
	Title            string `json:"title"`
	Description      string `json:"description"`
	Cuisine          string `json:"cuisine"`
	CookingMethod    string `json:"cookingMethod"`
	Category         string `json:"category"`
	ImageURL         string `json:"imageURL"`
	Yields           string `json:"yields"`
	PrepTimeMinutes  int32  `json:"prepTimeMinutes"`
	CookTimeMinutes  int32  `json:"cookTimeMinutes"`
	TotalTimeMinutes int32  `json:"totalTimeMinutes"`
	Created          string `json:"created"`

	Ingredients  []Ingredient  `json:"ingredients"`
	Instructions []Instruction `json:"instructions"`
}

type Ingredient struct {
	ID              string  `json:"id"`
	RecipeID        string  `json:"recipeID"`
	FullText        string  `json:"fullText"`
	IsOptional      bool    `json:"isOptional"`
	Name            string  `json:"name"`
	Quantity        float64 `json:"quantity"`
	QuantityString  string  `json:"quantityString"`
	Unit            string  `json:"unit"`
	Size            string  `json:"size"`
	IngredientGroup string  `json:"ingredientGroup"`
	Created         string  `json:"created"`
}

type Instruction struct {
	ID       string  `json:"id"`
	RecipeID string  `json:"recipeID"`
	Index    int32   `json:"index"`
	FullText string  `json:"fullText"`
	HasTimer bool    `json:"hasTimer"`
	Created  string  `json:"created"`
	Timers   []Timer `json:"timers"`
}

type Timer struct {
	ID            string `json:"id"`
	InstructionID string `json:"instructionID"`
	Value         int32  `json:"value"`
	Unit          string `json:"unit"`
	Created       string `json:"created"`
}
