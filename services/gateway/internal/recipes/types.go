package recipes

type Recipe struct {
	ID               string `json:"id"`
	RecipeURL        string `json:"recipe_url"`
	Title            string `json:"title"`
	Description      string `json:"description"`
	Cuisine          string `json:"cuisine"`
	CookingMethod    string `json:"cooking_method"`
	Category         string `json:"category"`
	ImageURL         string `json:"image_url"`
	Yields           string `json:"yields"`
	PrepTimeMinutes  int32  `json:"prep_time_minutes"`
	CookTimeMinutes  int32  `json:"cook_time_minutes"`
	TotalTimeMinutes int32  `json:"total_time_minutes"`
	Created          string `json:"created"`

	Ingredients  []Ingredient  `json:"ingredients"`
	Instructions []Instruction `json:"instructions"`
}

type Ingredient struct {
	ID              string  `json:"id"`
	RecipeID        string  `json:"recipe_id"`
	FullText        string  `json:"full_text"`
	IsOptional      bool    `json:"is_optional"`
	Name            string  `json:"name"`
	Quantity        float64 `json:"quantity"`
	QuantityString  string  `json:"quantity_string"`
	Unit            string  `json:"unit"`
	Size            string  `json:"size"`
	IngredientGroup string  `json:"ingredient_group"`
	Created         string  `json:"created"`
}

type Instruction struct {
	ID       string  `json:"id"`
	RecipeID string  `json:"recipe_id"`
	Index    int32   `json:"index"`
	FullText string  `json:"full_text"`
	HasTimer bool    `json:"has_timer"`
	Created  string  `json:"created"`
	Timers   []Timer `json:"timers"`
}

type Timer struct {
	ID            string `json:"id"`
	InstructionID string `json:"instruction_id"`
	Value         int32  `json:"value"`
	Unit          string `json:"unit"`
	Created       string `json:"created"`
}
