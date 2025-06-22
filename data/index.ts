import { cache } from "react";

import { db } from "./db";
import config from "@/config";
import { NodePgClient, NodePgDatabase } from "drizzle-orm/node-postgres";
import { GroceryList, Ingredient, MEAL, MealPlan, Recipe } from "@/types/index";
import { eq } from "drizzle-orm";
import { ingredientsTable, recipeIngredientsTable, recipesTable, usersTable } from "./db/schema";

class DataManager {
    constructor(private db: NodePgDatabase<Record<string, never>> & {
        $client: NodePgClient;
    }) {}

    async generateMealPlan(): Promise<MealPlan> {
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

    async deriveGroceryList(mealPlan: MealPlan): Promise<GroceryList> {
        const ingredients = await Promise.all([
            this.deriveRecipeIngredients(mealPlan[MEAL.breakfast].id),
            this.deriveRecipeIngredients(mealPlan[MEAL.lunch].id),
            this.deriveRecipeIngredients(mealPlan[MEAL.snack].id),
            this.deriveRecipeIngredients(mealPlan[MEAL.supper].id),
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
            quantity: ingredient.quantity * config.menuDurationInDays,
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

    async showUser() {
        return db.select().from(usersTable);
    } 
}

export const dataManager = new DataManager(db);
export const cachedMealPlan = cache(async () => dataManager.generateMealPlan());