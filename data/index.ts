import { cache } from "react";

import { NodePgClient, NodePgDatabase } from "drizzle-orm/node-postgres";
import { eq } from "drizzle-orm";
import { db } from "./db";
import { ingredientsTable, recipeIngredientsTable, recipesTable } from "./db/schema";

import Week from "./Week";
import { CookingStyle, GroceryGroups, GroceryList, Ingredient, MEAL, Menu, RecipeIngredient, WEEK_DURATION, WeekMealPlan } from "@/types/index";

type Db = NodePgDatabase<Record<string, never>> & {
    $client: NodePgClient;
}

class WeekMealPlanGenerator {
    private db: Db = db;
    private week: Week = new Week(new Date);
    private weekMealPlan?: WeekMealPlan | null = null;

    constructor(
            private workingWeekCookingStyle: CookingStyle,
            private weekendCookingStyle: CookingStyle,
            private weekendIncluded: boolean,
    ) {}
    
    async generate(): Promise<{ weekMealPlan: WeekMealPlan; groceryList: GroceryList; }> {
        const weekMealPlan = await this.generateMealPlan();
        const groceryList = await this.deriveGroceryList(weekMealPlan);

        return {
            weekMealPlan,
            groceryList,
        }
    }

    private async generateMealPlan(): Promise<WeekMealPlan> {
        const periods = this.week.getMenuPeriods(this.workingWeekCookingStyle, this.weekendCookingStyle, true)

        const menus = await Promise.all(
            periods.map(async (period) => ({
                period,
                menu: await this.generateMenu(),
            }))
        )

        this.weekMealPlan = {
            period: this.week.getWeekPeriod(),
            menus,
        }

        return this.weekMealPlan;
    }

    private async generateMenu(): Promise<Menu> {
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

    private async deriveGroceryList(weekMealPlan: WeekMealPlan): Promise<GroceryList> {
    const recipeIds = weekMealPlan.menus.flatMap(({ menu }) => [
        menu[MEAL.breakfast].id,
        menu[MEAL.lunch].id,
        menu[MEAL.snack].id,
        menu[MEAL.supper].id,
    ]);

    const ingredients = await Promise.all(
        recipeIds.map((id) => this.deriveRecipeIngredients(id))
    );

    const summarizedIngredients = this.summarizeIngredients(ingredients.flat());

    return this.groupIngredientsByAisle(summarizedIngredients);
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
        return Object.entries(ingredients.reduce<GroceryGroups>((acc, ingredient) => {
            const aisle = ingredient.aisle || "Uncategorized"

            if (!acc[aisle]) {
                acc[aisle] = []
            }

            acc[aisle].push(ingredient)

            return acc;
        }, {}));
    }

    private pickRandom<T>(array: T[]): T {
        return array[Math.floor(Math.random() * array.length)];
    }
}

export const cachedWeekMealPlan = (...args: [CookingStyle.Lazy, CookingStyle.Lazy, boolean]) => {
    const weekMealPlan = new WeekMealPlanGenerator(...args);

    return cache(async () => weekMealPlan.generate())();
}