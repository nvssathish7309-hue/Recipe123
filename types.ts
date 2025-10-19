export enum View {
  SEARCH,
  RESULTS,
  ADMIN,
}

export enum SearchType {
  RECIPE = 'recipe',
  INGREDIENTS = 'ingredients',
}

export interface Ingredient {
  name: string;
  amount: string;
}

export interface IngredientList {
  recipeName: string;
  ingredients: Ingredient[];
  instructions: string[];
}

export interface Recipe {
  recipeName: string;
  description: string;
  ingredients: string[];
  instructions: string[];
}

export type ResultsData = IngredientList | Recipe[] | null;