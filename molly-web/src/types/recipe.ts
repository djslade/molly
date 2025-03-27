export type Timer = {
  id: string;
  instruction_id: string;
  value: number;
  unit: string;
  created: string;
};

export type Instruction = {
  id: string;
  recipe_id: string;
  index: number;
  full_text: string;
  has_timer?: boolean;
  timers?: Timer[];
  created: string;
};

export type Ingredient = {
  id: string;
  recipe_id: string;
  full_text: string;
  is_optional?: boolean;
  name?: string;
  quantity?: number;
  quantity_string?: string;
  unit?: string;
  size?: string;
  ingredient_group?: string;
  created: string;
};

export type Recipe = {
  id: string;
  recipe_url: string;
  title?: string;
  description?: string;
  cooking_method?: string;
  cuisine?: string;
  category?: string;
  image_url?: string;
  yields?: string;
  prep_time_minutes?: number;
  cook_time_minutes?: number;
  total_time_minutes?: number;
  ingredients: Ingredient[];
  instructions: Instruction[];
  created: string;
};
