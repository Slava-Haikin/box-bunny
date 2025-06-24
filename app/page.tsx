import HomePage from "@/components/pages/HomePage";

import { cachedWeekMealPlan } from "@/data";
import { CookingStyle } from "@/types/index";

export default async function Home() {
  const { weekMealPlan, groceryList } = await cachedWeekMealPlan(
    CookingStyle.Lazy,
    CookingStyle.Lazy,
    true,
  );

  return <HomePage weekMealPlan={weekMealPlan} groceryList={groceryList} />;
}
