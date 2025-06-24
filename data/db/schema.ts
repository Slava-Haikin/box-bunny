import { enumToPgEnum } from "@/lib/utils";
import { COOKING_DIFFICULTY, MEAL, RecipeTag, USER_ROLES } from "@/types/index";
import {
  integer,
  pgTable,
  varchar,
  pgEnum,
  timestamp,
  text,
  numeric,
} from "drizzle-orm/pg-core";

const timestamps = {
  updatedAt: timestamp(),
  createdAt: timestamp().defaultNow().notNull(),
  deletedAt: timestamp(),
};

export const roleEnum = pgEnum("role", enumToPgEnum(USER_ROLES));
export const mealEnum = pgEnum("meal", enumToPgEnum(MEAL));
export const difficultyEnum = pgEnum(
  "difficulty",
  enumToPgEnum(COOKING_DIFFICULTY),
);
export const recipeTagEnum = pgEnum("recipeTags", enumToPgEnum(RecipeTag));

export const usersTable = pgTable("users", {
  id: integer("id").primaryKey().generatedByDefaultAsIdentity(),
  email: varchar("email").notNull(),
  hashedPassword: varchar("hashed_password").notNull(),
  role: roleEnum("role").notNull(),
  firstName: varchar("first_name").notNull(),
  lastName: varchar("last_name").notNull(),
  ...timestamps,
});

export const recipesTable = pgTable("recipes", {
  id: integer("id").primaryKey().generatedByDefaultAsIdentity(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  instructions: text("instructions").array().notNull(),
  meal: mealEnum("meal").notNull(),
  difficulty: difficultyEnum("difficulty").notNull(),
  cookTimeInMinutes: integer("cook_time_in_minutes").notNull(),
  servings: integer("servings").notNull(),
  imageUrl: text("image_url").notNull(),
  tags: recipeTagEnum("recipeTags").array().notNull(),
  ...timestamps,
});

export const ingredientsTable = pgTable("ingredients", {
  id: integer("id").primaryKey().generatedByDefaultAsIdentity(),
  original: text("original").notNull(),
  name: text("name").notNull(),
  unit: varchar("unit"),
  shortUnit: varchar("short_unit"),
  longUnit: text("long_unit"),
  possibleUnits: text("possible_units").array(),
  estimatedCostValue: numeric("estimated_cost_value"),
  estimatedCostUnit: varchar("estimated_cost_unit"),
  consistency: text("consistency"),
  shoppingListUnits: varchar("shopping_list_units").array(),
  aisle: varchar("aisle"),
  imageUrl: text("image_url"),
  ...timestamps,
});

export const recipeIngredientsTable = pgTable("recipe_ingredients", {
  id: integer("id").primaryKey().generatedByDefaultAsIdentity(),
  recipeId: integer("recipe_id")
    .references(() => recipesTable.id)
    .notNull(),
  ingredientId: integer("ingredient_id")
    .references(() => ingredientsTable.id)
    .notNull(),
  quantity: numeric("quantity").notNull(),
  ...timestamps,
});
