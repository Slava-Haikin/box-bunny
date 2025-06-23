import HomePage from "@/components/pages/HomePage";

import { cachedMenu, weekMealPlan } from "@/data";
import { Recipe } from "@/types/index";

export default async function Home() {
  const mealPlan = await cachedMenu();
  const recipes: Recipe[] = Object.values(mealPlan);
  const groceryList = await weekMealPlan.deriveGroceryList(mealPlan);

  return (
    <HomePage mealPlan={mealPlan} recipes={recipes} groceryList={groceryList} />
  );
}
