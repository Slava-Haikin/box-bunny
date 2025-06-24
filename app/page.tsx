import HomePage from "@/components/pages/HomePage";

import { cachedWeekMealPlan } from "@/data";
import { CookingStyle } from "@/types/index";

export default async function Home() {
  const { weekMealPlan, groceryList, recipes } = await cachedWeekMealPlan(CookingStyle.Lazy, CookingStyle.Lazy, true);
  // console.log(weekMealPlan);

  return (
    <HomePage weekMealPlan={weekMealPlan} recipes={recipes} groceryList={groceryList} />
  );
}
