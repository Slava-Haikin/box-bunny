import { ingredientsTable, recipesTable } from "@/data/db/schema";

export type Configuration = {
  dbUrl: string;
  ownerFirstName: string;
  ownerLastName: string;
  ownerEmail: string;
  ownerHashedPassword: string;
  menuDurationInDays: number;
  rootDir: string;
};

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

type Ingredient =  typeof ingredientsTable.$inferSelect & { quantity?: number };
type Recipe = typeof recipesTable.$inferSelect;

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