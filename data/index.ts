import { cache } from "react";

import { NodePgClient, NodePgDatabase } from "drizzle-orm/node-postgres";
import { eq } from "drizzle-orm";
import { db } from "./db";
import { ingredientsTable, recipeIngredientsTable, recipesTable } from "./db/schema";

import Week from "./Week";
import { CookingStyle, GroceryList, Ingredient, MEAL, Menu, WEEK_DURATION, WeekMealPlan } from "@/types/index";

const deriveMenuUpdateInterval = (cookingStyle: CookingStyle) => {
  switch (cookingStyle) {
    case CookingStyle.Chief:
      return 1;
    case CookingStyle.Regular:
      return 3;
    default:
      return 7;
  }
}

type Db = NodePgDatabase<Record<string, never>> & {
    $client: NodePgClient;
}

class WeekMealPlanGenerator {
    private week: Week;
    private mealPlan?: Menu | null = null;

    constructor(
        private db: Db,
        private options: {
            workingWeekCookingStyle: CookingStyle,
            weekendIncluded: boolean,
            weekendCookingStyle: CookingStyle
        }) {
            this.week =  new Week(new Date);
    }

    async generate(): Promise<WeekMealPlan> {
        // Calculate total menus number
        const workingWeekMenuNumber = Math.ceil(WEEK_DURATION.workingWeekDuration / deriveMenuUpdateInterval(this.options.workingWeekCookingStyle));
        const weekendMenuNumber = Math.ceil(WEEK_DURATION.weekendDuration / deriveMenuUpdateInterval(this.options.weekendCookingStyle));
        const menusWithoudPeriod: Menu[] = [];

        // Generate menus
        for (let i = 0; i < workingWeekMenuNumber + weekendMenuNumber; i++ ) {
            const newMenu = await this.generateMenu();
            menusWithoudPeriod.push(newMenu)
        }

        // Map menus to dates
        const menus = menusWithoudPeriod.map((menu, index) => ({
            menu,
            period: index === 0 ? this.week.getWorkingWeekPeriod() : this.week.getWeekendPeriod(),
        }));

        // Return result
        return {
            period: this.week.getWeekPeriod(),
            menus,
        }
    }

    async generateMenu(): Promise<Menu> {
        const breakfasts = await this.db.select().from(recipesTable).where(eq(recipesTable.meal, MEAL.breakfast));
        const lunches = await this.db.select().from(recipesTable).where(eq(recipesTable.meal, MEAL.lunch));
        const snacks = await this.db.select().from(recipesTable).where(eq(recipesTable.meal, MEAL.snack));
        const suppers = await this.db.select().from(recipesTable).where(eq(recipesTable.meal, MEAL.supper));

        return {
            [MEAL.breakfast]: this.pickRandom(breakfasts),
            [MEAL.lunch]: this.pickRandom(lunches),
            [MEAL.snack]: this.pickRandom(snacks),
            [MEAL.supper]: this.pickRandom(suppers),
        };
    }

    async deriveGroceryList(menu: Menu): Promise<GroceryList> {
        const ingredients = await Promise.all([
            this.deriveRecipeIngredients(menu[MEAL.breakfast].id),
            this.deriveRecipeIngredients(menu[MEAL.lunch].id),
            this.deriveRecipeIngredients(menu[MEAL.snack].id),
            this.deriveRecipeIngredients(menu[MEAL.supper].id),
        ])
        const summarizedIngredients = this.summarizeIngredients(ingredients.flat())

        return this.groupIngredientsByAisle(summarizedIngredients)
    }

    private async deriveRecipeIngredients(recipeId: number): Promise<(Ingredient  & { quantity: number })[]> {
        const rows = await this.db
            .select({
                ingredient: ingredientsTable,
                quantity: recipeIngredientsTable.quantity,
            })
            .from(recipeIngredientsTable)
            .innerJoin(
                ingredientsTable,
                eq(recipeIngredientsTable.ingredientId, ingredientsTable.id)
            )
            .where(eq(recipeIngredientsTable.recipeId, Number(recipeId)));

        return rows.map(row => ({
            ...row.ingredient,
            quantity: Number(row.quantity),
        }));
    }

    private summarizeIngredients(ingredients: (Ingredient  & { quantity: number })[]): (Ingredient  & { quantity: number })[] {
        const merged = ingredients.reduce<(Ingredient  & { quantity: number })[]>((acc, ingredient) => {
            const existing = acc.find(item => item.id === ingredient.id);

            if (existing) {
                existing.quantity += ingredient.quantity;
            } else {
                acc.push({ ...ingredient });
            }

            return acc;
        }, []);

        return merged.map(ingredient => ({
            ...ingredient,
            quantity: ingredient.quantity * WEEK_DURATION.weekDuration,
        }));
    }

    private groupIngredientsByAisle(ingredients: (Ingredient  & { quantity: number })[]) {
        return ingredients.reduce<GroceryList>((acc, ingredient) => {
            const aisle = ingredient.aisle || "Uncategorized"

            if (!acc[aisle]) {
                acc[aisle] = []
            }

            acc[aisle].push(ingredient)

            return acc;
        }, {});
    }

    private pickRandom<T>(array: T[]): T {
        return array[Math.floor(Math.random() * array.length)];
    }
}

export const weekMealPlan = new WeekMealPlanGenerator(db, {
    workingWeekCookingStyle: CookingStyle.Lazy,
    weekendCookingStyle: CookingStyle.Lazy,
    weekendIncluded: true,
});

export const cachedMenu = cache(async () => weekMealPlan.generateMenu());