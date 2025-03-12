package recipes

type Ingredient struct {
	FullText   string  `json:"full_text"`
	Quantity   float64 `json:"quantity"`
	Unit       string  `json:"unit"`
	Name       string  `json:"name"`
	IsOptional bool    `json:"is_optional"`
}

type Timer struct {
	Value int    `json:"value"`
	Unit  string `json:"unit"`
}

type Substep struct {
	Index int    `json:"index"`
	Text  string `json:"text"`
	Timer Timer  `json:"timer"`
}

type Step struct {
	Index    int       `json:"index"`
	Text     string    `json:"text"`
	Substeps []Substep `json:"substep"`
}

type Recipe struct {
	Title       string       `json:"title"`
	Servings    string       `json:"servings"`
	CookingTime string       `json:"cooking_time"`
	NoSubsteps  bool         `json:"no_substeps"`
	Ingredients []Ingredient `json:"ingredients"`
	Steps       []Step       `json:"steps"`
}

// `input.wprm-recipe-servings.wprm-recipe-servings-91591`
