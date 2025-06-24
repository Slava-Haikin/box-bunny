import { expect, test } from "vitest";
import { render, screen } from "@testing-library/react";
import HomePage from "@/components/pages/HomePage";
import { cachedWeekMealPlan } from "@/data";
import { CookingStyle } from "@/types";

test("Page", async () => {
  const { weekMealPlan, groceryList } = await cachedWeekMealPlan(
    CookingStyle.Lazy,
    CookingStyle.Lazy,
    true,
  );

  render(<HomePage weekMealPlan={weekMealPlan} groceryList={groceryList} />);

  expect(
    screen.getByRole("heading", { level: 1, name: "This week:" }),
  ).toBeDefined();
});
