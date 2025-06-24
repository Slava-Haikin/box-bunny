import "dotenv/config";

import config from "@/config";
import { drizzle } from "drizzle-orm/node-postgres";
import { eq } from "drizzle-orm";
import {
  ingredientsTable,
  recipeIngredientsTable,
  recipesTable,
  usersTable,
} from "@/data/db/schema";
import { COOKING_DIFFICULTY, MEAL, RecipeTag, USER_ROLES } from "@/types/index";

const db = drizzle({ connection: config.dbUrl, casing: "snake_case" });

async function seedRecipes() {
  await db.delete(recipeIngredientsTable);
  await db.delete(recipesTable);

  const recipes = [
    {
      name: "Lazy Oatmeal",
      description: "A simple and quick breakfast option.",
      instructions: [
        "Add oats to a pot and boil it for 10 minutes.",
        "Pour milk, add peanut butter and greek yoghurt.",
        "Let sit overnight.",
        "Add crushed peanuts and chia seeds (optionally)",
      ],
      meal: MEAL.breakfast,
      difficulty: COOKING_DIFFICULTY.easy,
      cookTimeInMinutes: 5,
      servings: 1,
      imageUrl: "oatmeal.jpg",
      tags: [RecipeTag.VEGETARIAN],
    },
    {
      name: "Kefir with Marshmallows",
      description: "A light snack for afternoon time.",
      instructions: ["Pour kefir into a glass.", "Add one marshmallow."],
      meal: MEAL.snack,
      difficulty: COOKING_DIFFICULTY.easy,
      cookTimeInMinutes: 2,
      servings: 1,
      imageUrl: "kefir.jpg",
      tags: [RecipeTag.VEGETARIAN],
    },
    {
      name: "Buckwheat with Carrots and Chicken",
      description: "A nutritious lunch option with buckwheat and vegetables.",
      instructions: [
        "Boil buckwheat.",
        "Sauté carrots, onions, and garlic.",
        "Add ground chicken and tomato paste.",
        "Combine with buckwheat.",
      ],
      meal: MEAL.lunch,
      difficulty: COOKING_DIFFICULTY.medium,
      cookTimeInMinutes: 30,
      servings: 2,
      imageUrl: "buckwheat.jpg",
      tags: [RecipeTag.GLUTEN_FREE],
    },
    {
      name: "Mujaddara (Rice with Lentils)",
      description: "A healthy dinner option with rice and lentils.",
      instructions: [
        "Boil rice and lentils.",
        "Fry onions.",
        "Combine with rice and lentils.",
      ],
      meal: MEAL.supper,
      difficulty: COOKING_DIFFICULTY.medium,
      cookTimeInMinutes: 40,
      servings: 2,
      imageUrl: "mujaddara.jpg",
      tags: [RecipeTag.VEGAN, RecipeTag.GLUTEN_FREE],
    },
  ];

  await db.insert(recipesTable).values(recipes);
  console.log("Recipes seeded!");
}

async function seedOwner() {
  const user: typeof usersTable.$inferInsert = {
    firstName: config.ownerFirstName ?? "",
    lastName: config.ownerLastName ?? "",
    email: config.ownerEmail ?? "",
    hashedPassword: config.ownerHashedPassword ?? "",
    role: USER_ROLES.OWNER,
  };

  const existingUser = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.email, user.email))
    .limit(1);

  if (existingUser.length === 0) {
    await db.insert(usersTable).values(user);
    console.log("New user created!");
  } else {
    console.log("User already exists, skipping insert.");
  }

  const users = await db.select().from(usersTable);
  console.log("All users:", users);
}

export async function seedIngredients() {
  await db.delete(ingredientsTable);

  const ingredients = [
    {
      original: "oats",
      name: "oats",
      unit: "g",
      shortUnit: "g",
      longUnit: "grams",
      possibleUnits: ["g", "cup"],
      estimatedCostValue: "100",
      estimatedCostUnit: "US Cents",
      consistency: "solid",
      shoppingListUnits: ["g"],
      aisle: "Grocery",
      imageUrl: "oats.jpg",
    },
    {
      original: "milk",
      name: "milk",
      unit: "ml",
      shortUnit: "ml",
      longUnit: "milliliters",
      possibleUnits: ["ml", "cup"],
      estimatedCostValue: "50",
      estimatedCostUnit: "US Cents",
      consistency: "liquid",
      shoppingListUnits: ["ml"],
      aisle: "Dairy",
      imageUrl: "kefir.jpg",
    },
    {
      original: "kefir",
      name: "kefir",
      unit: "ml",
      shortUnit: "ml",
      longUnit: "milliliters",
      possibleUnits: ["ml", "cup"],
      estimatedCostValue: "50",
      estimatedCostUnit: "US Cents",
      consistency: "liquid",
      shoppingListUnits: ["ml"],
      aisle: "Dairy",
      imageUrl: "kefir.jpg",
    },
    {
      original: "marshmallows",
      name: "marshmallows",
      unit: "g",
      shortUnit: "g",
      longUnit: "grams",
      possibleUnits: ["g", "piece"],
      estimatedCostValue: "80",
      estimatedCostUnit: "US Cents",
      consistency: "solid",
      shoppingListUnits: ["g"],
      aisle: "Sweets",
      imageUrl: "marshmallows.jpg",
    },
    {
      original: "buckwheat",
      name: "buckwheat",
      unit: "g",
      shortUnit: "g",
      longUnit: "grams",
      possibleUnits: ["g", "cup"],
      estimatedCostValue: "150",
      estimatedCostUnit: "US Cents",
      consistency: "solid",
      shoppingListUnits: ["g"],
      aisle: "Grocery",
      imageUrl: "buckwheat.jpg",
    },
    {
      original: "carrot",
      name: "carrot",
      unit: "g",
      shortUnit: "g",
      longUnit: "grams",
      possibleUnits: ["g"],
      estimatedCostValue: "40",
      estimatedCostUnit: "US Cents",
      consistency: "solid",
      shoppingListUnits: ["g"],
      aisle: "Produce",
      imageUrl: "carrot.jpg",
    },
    {
      original: "onion",
      name: "onion",
      unit: "g",
      shortUnit: "g",
      longUnit: "grams",
      possibleUnits: ["g"],
      estimatedCostValue: "30",
      estimatedCostUnit: "US Cents",
      consistency: "solid",
      shoppingListUnits: ["g"],
      aisle: "Produce",
      imageUrl: "onion.jpg",
    },
    {
      original: "garlic",
      name: "garlic",
      unit: "g",
      shortUnit: "g",
      longUnit: "grams",
      possibleUnits: ["g"],
      estimatedCostValue: "10",
      estimatedCostUnit: "US Cents",
      consistency: "solid",
      shoppingListUnits: ["g"],
      aisle: "Produce",
      imageUrl: "garlic.jpg",
    },
    {
      original: "minced_meat",
      name: "minced meat",
      unit: "g",
      shortUnit: "g",
      longUnit: "grams",
      possibleUnits: ["g"],
      estimatedCostValue: "250",
      estimatedCostUnit: "US Cents",
      consistency: "solid",
      shoppingListUnits: ["g"],
      aisle: "Meat",
      imageUrl: "minced_meat.jpg",
    },
    {
      original: "tomato_paste",
      name: "tomato paste",
      unit: "g",
      shortUnit: "g",
      longUnit: "grams",
      possibleUnits: ["g"],
      estimatedCostValue: "40",
      estimatedCostUnit: "US Cents",
      consistency: "solid",
      shoppingListUnits: ["g"],
      aisle: "Grocery",
      imageUrl: "tomato_paste.jpg",
    },
    {
      original: "rice",
      name: "rice",
      unit: "g",
      shortUnit: "g",
      longUnit: "grams",
      possibleUnits: ["g", "cup"],
      estimatedCostValue: "100",
      estimatedCostUnit: "US Cents",
      consistency: "solid",
      shoppingListUnits: ["g"],
      aisle: "Grocery",
      imageUrl: "rice.jpg",
    },
    {
      original: "lentils",
      name: "lentils",
      unit: "g",
      shortUnit: "g",
      longUnit: "grams",
      possibleUnits: ["g", "cup"],
      estimatedCostValue: "150",
      estimatedCostUnit: "US Cents",
      consistency: "solid",
      shoppingListUnits: ["g"],
      aisle: "Grocery",
      imageUrl: "lentils.jpg",
    },
    {
      original: "peanut_butter",
      name: "peanut butter",
      unit: "g",
      shortUnit: "g",
      longUnit: "grams",
      possibleUnits: ["g"],
      estimatedCostValue: "150",
      estimatedCostUnit: "US Cents",
      consistency: "solid",
      shoppingListUnits: ["g"],
      aisle: "Grocery",
      imageUrl: "peanut_butter.jpg",
    },
    {
      original: "greek_yogurt",
      name: "greek yogurt",
      unit: "g",
      shortUnit: "g",
      longUnit: "grams",
      possibleUnits: ["g"],
      estimatedCostValue: "120",
      estimatedCostUnit: "US Cents",
      consistency: "solid",
      shoppingListUnits: ["g"],
      aisle: "Dairy",
      imageUrl: "greek_yogurt.jpg",
    },
    {
      original: "peanuts",
      name: "peanuts",
      unit: "g",
      shortUnit: "g",
      longUnit: "grams",
      possibleUnits: ["g"],
      estimatedCostValue: "200",
      estimatedCostUnit: "US Cents",
      consistency: "solid",
      shoppingListUnits: ["g"],
      aisle: "Grocery",
      imageUrl: "peanuts.jpg",
    },
    {
      original: "chia_seeds",
      name: "chia seeds",
      unit: "g",
      shortUnit: "g",
      longUnit: "grams",
      possibleUnits: ["g"],
      estimatedCostValue: "250",
      estimatedCostUnit: "US Cents",
      consistency: "solid",
      shoppingListUnits: ["g"],
      aisle: "Grocery",
      imageUrl: "chia_seeds.jpg",
    },
  ];

  await db.insert(ingredientsTable).values(ingredients);
  console.log("Ingredients seeded!");
}

export async function seedRecipeIngredients() {
  await db.delete(recipeIngredientsTable);
  console.log("Old recipe_ingredients deleted.");

  const values = [
    { recipeId: 1, ingredientId: 1, quantity: "50" },
    { recipeId: 1, ingredientId: 13, quantity: "30" },
    { recipeId: 1, ingredientId: 15, quantity: "10" },
    { recipeId: 1, ingredientId: 16, quantity: "5" },
    { recipeId: 1, ingredientId: 2, quantity: "200" },
    { recipeId: 1, ingredientId: 14, quantity: "50" },

    { recipeId: 2, ingredientId: 3, quantity: "200" },
    { recipeId: 2, ingredientId: 4, quantity: "50" },

    { recipeId: 3, ingredientId: 5, quantity: "180" },
    { recipeId: 3, ingredientId: 6, quantity: "330" },
    { recipeId: 3, ingredientId: 7, quantity: "120" },
    { recipeId: 3, ingredientId: 8, quantity: "40" },
    { recipeId: 3, ingredientId: 9, quantity: "100" },
    { recipeId: 3, ingredientId: 10, quantity: "50" },

    { recipeId: 4, ingredientId: 11, quantity: "100" },
    { recipeId: 4, ingredientId: 12, quantity: "100" },
    { recipeId: 4, ingredientId: 7, quantity: "120" },
  ];

  await db.insert(recipeIngredientsTable).values(values);
  console.log("Recipe ingredients seeded!");
}

async function main() {
  await seedOwner();
  await seedRecipes();
  await seedIngredients();
  await seedRecipeIngredients();

  console.log("✅ Seed completed!");
}

main().catch((e) => {
  console.error("❌ Seed error:", e);
  process.exit(1);
});
