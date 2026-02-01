export type Timer = {
  id: string;
  instructionID: string;
  value: number;
  unit: string;
  created: string;
};

export type Instruction = {
  id: string;
  recipeID: string;
  index: number;
  fullText: string;
  hasTimer: boolean;
  timers: Timer[];
  created: string;
};

export type Ingredient = {
  id: string;
  recipeID: string;
  fullText: string;
  isOptional: boolean;
  name: string;
  quantity: number;
  quantityString: string;
  unit: string;
  size: string;
  ingredientGroup: string;
  created: string;
};

export type RecipeData = {
  id: string;
  recipeURL: string;
  title: string;
  description: string;
  cookingMethod: string;
  cuisine: string;
  category: string;
  imageURL: string;
  yields: string;
  prepTimeMinutes: number;
  cookTimeMinutes: number;
  totalTimeMinutes: number;
  ingredients: Ingredient[];
  instructions: Instruction[];
  created: string;
};
