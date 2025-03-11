package recipes

type Ingredient struct {
	FullText   string  `json:"full_text"`
	Quantity   float32 `json:"quantity"`
	Unit       string  `json:"unit"`
	Name       string  `json:"name"`
	IsOptional bool    `json:"is_optional"`
}

type Timer struct {
	Value int `json:"value"`
	Unit  int `json:"unit"`
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
	Ingredients []Ingredient `json:"ingredients"`
	Steps       []Step       `json:"steps"`
}
