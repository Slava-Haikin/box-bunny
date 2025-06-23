import { ingredientsTable, recipesTable } from "@/data/db/schema";

// ENUMS
enum WEEK_DURATION {
    weekDuration = 7,
    weekendDuration = 2,
    workingWeekDuration = 5,
}

enum USER_ROLES {
    'GUEST' = 'guest',
    'USER' = 'user',
    'OWNER' = 'owner',
}

enum CookingStyle {
    Lazy = 'lazy',
    Regular = 'regular',
    Chief = 'chief',
}

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

// Meal Plan
type Aisle = string
type Ingredient =  typeof ingredientsTable.$inferSelect;
type RecipeIngredient = Ingredient & { quantity: number }
type Recipe = typeof recipesTable.$inferSelect;

interface Period {
    start: Date,
    end: Date,
}

interface Menu {
    [MEAL.breakfast]: Recipe;
    [MEAL.brunch]?: Recipe;
    [MEAL.lunch]: Recipe;
    [MEAL.snack]: Recipe;
    [MEAL.supper]: Recipe;
}

interface WeekMealPlan {
    period: Period,
    menus: { 
        menu: Menu, 
        period: Period,
    }[]
}

type GroceryList = Record<Aisle, RecipeIngredient[]>

// Configuration
export type Configuration = {
  dbUrl: string;
  ownerFirstName: string;
  ownerLastName: string;
  ownerEmail: string;
  ownerHashedPassword: string;
  rootDir: string;
};

// Exports
export type {
    Menu,
    Recipe,
    Period,
    Ingredient,
    GroceryList,
    WeekMealPlan,
    RecipeIngredient,
}

export {
    MEAL,
    COOKING_DIFFICULTY,
    USER_ROLES,
    RecipeTag,
    CookingStyle,
    WEEK_DURATION,
};