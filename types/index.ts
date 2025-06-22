// import { Ingredient } from "@/database/src/entity/Ingredient";
// import { Recipe } from "@/database/src/entity/Recipe";

import { ingredients, recipes } from "@/db/schema";

enum COOKING_DIFFICULTY {
    easy = 'easy',
    medium = 'medium',
    hard = 'hard',
}

enum MEAL {
    breakfast = 'breakfast',
    brunch = 'brunch',
    lunch = 'lunch',
    snack = 'snack',
    supper = 'supper',
}

enum RecipeTag {
  GLUTEN_FREE = 'gluten free',
  VEGETARIAN = 'vegetarian',
  VEGAN = 'vegan',
}

// interface Recipe {
//     id: string;
//     title: string;
//     description: string;
//     instructions: string[];
//     meal: MEAL;
//     difficulty: COOKING_DIFFICULTY;
//     cookTime: number;
//     servings: number;
//     imageUrl: string;
//     tags: 'gluten free' | 'vegetarian' | 'vegan'[];
// }

// interface Ingredient {
//     id: string;
//     original: string;
//     name: string;
//     unit: string | null;
//     unit_short: string | null;
//     unit_long: string | null;
//     possible_units: string | null;
//     quantity: number;
//     estimated_cost_value: number | null;
//     estimated_cost_unit: string | null;
//     consistency: string | null;
//     shopping_list_units: string | null;
//     aisle: string | null;
//     image_url: string | null;
//     created_at: string;
//     updated_at: string;
// }

type Ingredient =  typeof ingredients.$inferSelect & { quantity?: number };
type Recipe = typeof recipes.$inferSelect;

interface MealPlan {
    [MEAL.breakfast]: Recipe;
    [MEAL.brunch]?: Recipe;
    [MEAL.lunch]: Recipe;
    [MEAL.snack]: Recipe;
    [MEAL.supper]: Recipe;
}

type GroceryList = Record<string, (Ingredient & { quantity: number })[]>

export enum USER_ROLES {
    'GUEST' = 'guest',
    'USER' = 'user',
    'OWNER' = 'owner',
}

export type {
    MealPlan,
    Recipe,
    Ingredient,
    GroceryList,
}

export { MEAL, COOKING_DIFFICULTY, RecipeTag };