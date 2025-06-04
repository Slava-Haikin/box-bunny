import { GroceryList, Ingredient, MEAL, MealPlan, Recipe } from "@/types";
import { DatabaseConnector } from "../source/connector";
import SQL_QUERIES from "../queries";
import { db } from "../source";
import { cache } from "react";

class DataManager {
    constructor(private db: DatabaseConnector) {}

    async generateMealPlan(): Promise<MealPlan> {
        const data = await Promise.all([
            this.db.readData<Recipe>(SQL_QUERIES.selectRecipes.breakfasts),
            this.db.readData<Recipe>(SQL_QUERIES.selectRecipes.lunchs),
            this.db.readData<Recipe>(SQL_QUERIES.selectRecipes.snacks),
            this.db.readData<Recipe>(SQL_QUERIES.selectRecipes.suppers),
        ])

        return {
            [MEAL.breakfast]: data[0][Math.floor(Math.random() * data[0].length)],
            [MEAL.lunch]: data[1][Math.floor(Math.random() * data[1].length)],
            [MEAL.snack]: data[2][Math.floor(Math.random() * data[2].length)],
            [MEAL.supper]: data[3][Math.floor(Math.random() * data[3].length)],
        }
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

    private deriveRecipeIngredients(recipeId: string): Promise<Ingredient[]>  {
        return db.readData<Ingredient>(SQL_QUERIES.selectRecipeIngredients, [recipeId])
    }

    private summarizeIngredients(ingredients: Ingredient[]) {
        return ingredients.reduce<Ingredient[]>((acc, ingredient) => {
            const index = acc.findIndex(item => item.id === ingredient.id);
            const isAlreadyExist = index >= 0;

            if (isAlreadyExist) {
                const currentValue = acc[index]

                acc[index] = {
                    ...currentValue,
                    quantity: currentValue.quantity + ingredient.quantity
                }

                return acc
            }

            return [...acc, ingredient]
        }, [])
    }

    private groupIngredientsByAisle(ingredients: Ingredient[]) {
        return ingredients.reduce<GroceryList>((acc, ingredient) => {
            const aisle = ingredient.aisle || "Uncategorized"

            if (!acc[aisle]) {
                acc[aisle] = []
            }

            acc[aisle].push(ingredient)

            return acc;
        }, {});
    }
}

export const dataManager = new DataManager(db);
export const cachedMealPlan = cache(async () => dataManager.generateMealPlan());