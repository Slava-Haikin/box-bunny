import { expect, test } from 'vitest'
import { render, screen } from '@testing-library/react'
import HomePage from "@/components/pages/HomePage";
import { cachedMealPlan, dataManager } from '@/data';
import { Recipe } from '@/types';
 
test('Page', async () => {
  const mealPlan = await cachedMealPlan();
  const recipes: Recipe[] = Object.values(mealPlan);
  const groceryList = await dataManager.deriveGroceryList(mealPlan);

  render(<HomePage mealPlan={mealPlan} recipes={recipes} groceryList={groceryList} />)

  expect(screen.getByRole('heading', { level: 1, name: 'This week:' })).toBeDefined()
})