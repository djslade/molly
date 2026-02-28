import { Expose, Type } from 'class-transformer';

export class RecipeDto {
  id: string = '';
  title: string = '';
  description: string = '';
  cuisine: string = '';
  category: string = '';
  yields: string = '';
  created: string = '';

  @Expose({ name: 'recipe_url' })
  recipeURL: string = '';

  @Expose({ name: 'cooking_method' })
  cookingMethod: string = '';

  @Expose({ name: 'image_url' })
  imageURL: string = '';

  @Expose({ name: 'prep_time_minutes' })
  prepTimeMinutes: number = 0;

  @Expose({ name: 'cook_time_minutes' })
  cookTimeMinutes: number = 0;

  @Expose({ name: 'total_time_minutes' })
  totalTimeMinutes: number = 0;

  @Type(() => IngredientDto)
  ingredients: IngredientDto[] = [];

  @Type(() => InstructionDto)
  instructions: InstructionDto[] = [];
}

export class IngredientDto {
  id: string = '';
  name: string = '';
  quantity: number = 0;
  unit: string = '';
  size: string = '';
  created: string = '';

  @Expose({ name: 'recipe_id' })
  recipeID: string = '';

  @Expose({ name: 'full_text' })
  fullText: string = '';

  @Expose({ name: 'is_optional' })
  isOptional: boolean = false;

  @Expose({ name: 'quantity_string' })
  quantityString: string = '';

  @Expose({ name: 'ingredient_group' })
  ingredientGroup: string = '';
}

export class InstructionDto {
  id: string = '';
  index: number = 0;
  created: string = '';

  @Expose({ name: 'recipe_id' })
  recipeID: string = '';

  @Expose({ name: 'full_text' })
  fullText: string = '';

  @Expose({ name: 'has_timer' })
  hasTimer: boolean = false;

  @Type(() => TimerDto)
  ingredients: TimerDto[] = [];
}

export class TimerDto {
  id: string = '';
  value: number = 0;
  unit: string = '';
  created: string = '';

  @Expose({ name: 'instruction_id' })
  instructionID: string = '';
}
