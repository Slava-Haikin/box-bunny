import { cache } from "react";

import { db } from "./db";
import { NodePgClient, NodePgDatabase } from "drizzle-orm/node-postgres";
import { CookingStyle, GroceryList, Ingredient, MEAL, Menu, Period, WEEK_DURATION, WeekMealPlan } from "@/types/index";
import { eq } from "drizzle-orm";
import { ingredientsTable, recipeIngredientsTable, recipesTable } from "./db/schema";

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
    private weekendPeriod: Period;
    private currentWeekPeriod: Period;
    private workingWeekPeriod: Period;
    
    private mealPlan?: Menu | null = null;

    constructor(
        private db: Db,
        private options: {
            workingWeekCookingStyle: CookingStyle,
            weekendIncluded: boolean,
            weekendCookingStyle: CookingStyle
        }) {
            this.currentWeekPeriod = this.getCurrentWeekPeriod();
            this.workingWeekPeriod = this.getWorkingWeekPeriod();
            this.weekendPeriod = this.getWeekendPeriod();
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
            period: index === 0 ? this.workingWeekPeriod : this.weekendPeriod,
        }));

        // Return result
        return {
            period: this.getCurrentWeekPeriod(),
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

    private getCurrentWeekPeriod(): Period {
        const today = new Date()

        const day = today.getDay() // 0 — воскресенье, 1 — понедельник, ..., 6 — суббота

        const diffToMonday = (day === 0 ? -6 : 1 - day)
        const start = new Date(today)
        start.setDate(today.getDate() + diffToMonday)
        start.setHours(0, 0, 0, 0)

        const end = new Date(start)
        end.setDate(start.getDate() + 6)
        end.setHours(23, 59, 59, 999)

        return { start, end }
    }

    private getWorkingWeekPeriod(): Period {
        const { start } = this.currentWeekPeriod

        const end = new Date(start)
        end.setDate(start.getDate() + WEEK_DURATION.workingWeekDuration - 1)
        end.setHours(23, 59, 59, 999)

        return { start: new Date(start), end }
    }

    private getWeekendPeriod(): Period {
        const start = new Date(this.currentWeekPeriod.start)
        start.setDate(start.getDate() + WEEK_DURATION.workingWeekDuration)
        start.setHours(0, 0, 0, 0)

        const end = new Date(start)
        end.setDate(start.getDate() + WEEK_DURATION.weekDuration - 1)
        end.setHours(23, 59, 59, 999)

        return { start, end }
    }
}

export const weekMealPlan = new WeekMealPlanGenerator(db, {
    workingWeekCookingStyle: CookingStyle.Lazy,
    weekendCookingStyle: CookingStyle.Lazy,
    weekendIncluded: true,
});

export const cachedMenu = cache(async () => weekMealPlan.generateMenu());