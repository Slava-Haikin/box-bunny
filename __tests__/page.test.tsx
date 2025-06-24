import { expect, test } from 'vitest'
import { render, screen } from '@testing-library/react'
import HomePage from "@/components/pages/HomePage";
import { cachedWeekMealPlan } from '@/data';
import { CookingStyle, Recipe } from '@/types';

test('Page', async () => {
  const { weekMealPlan, recipes, groceryList} = await cachedWeekMealPlan(CookingStyle.Lazy, CookingStyle.Lazy, true);

  render(<HomePage weekMealPlan={weekMealPlan} recipes={recipes} groceryList={groceryList} />)

  expect(screen.getByRole('heading', { level: 1, name: 'This week:' })).toBeDefined()
})
