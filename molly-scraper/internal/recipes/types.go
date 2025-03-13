package recipes

type Ingredient struct {
	FullText   string  `json:"full_text"`
	Quantity   float64 `json:"quantity"`
	Unit       string  `json:"unit"`
	Name       string  `json:"name"`
	IsOptional bool    `json:"is_optional"`
}

type Step struct {
	Index    int    `json:"index"`
	Text     string `json:"text"`
	HasTimer bool   `json:"has_timer"`
}

type Recipe struct {
	Title       string       `json:"title"`
	Ingredients []Ingredient `json:"ingredients"`
	Steps       []Step       `json:"steps"`
}
