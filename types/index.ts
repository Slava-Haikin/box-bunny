enum PREPARATION_DIFFICULTY {
    easy,
    medium,
    hard,
}

enum MEAL {
    breakfast,
    brunch,
    lunch,
    snack,
    supper,
}

interface Recipe {
    id: string;
    title: string;
    description: string;
    instructions: { instruction: string; illustration?: string }[];
    meal: MEAL;
    difficulty: PREPARATION_DIFFICULTY;
    cookTime: number;
    servings: number;
    imageUrl: string;
    tags: 'gluten free' | 'vegetarian' | 'vegan'[];
}

interface Ingredient {
    id: string;
    original: string;
    name: string;
    unit: string | null;
    unit_short: string | null;
    unit_long: string | null;
    possible_units: string | null;
    quantity: string;
    estimated_cost_value: number | null;
    estimated_cost_unit: string | null;
    consistency: string | null;
    shopping_list_units: string | null;
    aisle: string | null;
    image_url: string | null;
    created_at: string;
    updated_at: string;
}

interface MealPlan {
    [MEAL.breakfast]: Recipe;
    [MEAL.brunch]?: Recipe;
    [MEAL.lunch]: Recipe;
    [MEAL.snack]: Recipe;
    [MEAL.supper]: Recipe;
}

 type GroceryList = Record<string, Ingredient[]>

export type {
    MealPlan,
    Recipe,
    Ingredient,
    GroceryList,
}

export { MEAL };