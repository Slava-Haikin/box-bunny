import TodoPage from "@/components/pages/TodoPage";
import { cachedWeekMealPlan } from "@/data";
import { CookingStyle } from "@/types";

export default async function LoginRoute() {
  const { weekMealPlan, groceryList } = await cachedWeekMealPlan(
    CookingStyle.Lazy,
    CookingStyle.Lazy,
    true,
  );

  return <TodoPage weekMealPlan={weekMealPlan} groceryList={groceryList} />;
}
