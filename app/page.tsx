import HomePage from "@/components/pages/HomePage";

import { cachedMealPlan, dataManager } from "@/data";
import { Recipe } from "@/types/index";

export default async function Home() {
  const mealPlan = await cachedMealPlan();
  const recipes: Recipe[] = Object.values(mealPlan);
  const groceryList = await dataManager.deriveGroceryList(mealPlan);

  return (
    <HomePage mealPlan={mealPlan} recipes={recipes} groceryList={groceryList} />
  );
}
