import { DatabaseConnector } from "../connection";
import SQL_QUERIES from "../sql-queries";

const initializeDb = async (db: DatabaseConnector): Promise<void> => {
    await db.updateData(SQL_QUERIES.createRecipesTable)
    await db.updateData(SQL_QUERIES.createIngredientsTable)
    await db.updateData(SQL_QUERIES.createRecipeIngredientsTable)
}