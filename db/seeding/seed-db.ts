import { DatabaseConnector, db } from "../source"
import SQL_QUERIES from "../queries"

const seedDb=async(db: DatabaseConnector): Promise<void> => {
    await db.updateData(SQL_QUERIES.seedData.createRecipesTable)
    await db.updateData(SQL_QUERIES.seedData.createIngredientsTable)
    await db.updateData(SQL_QUERIES.seedData.createRecipesIngredientsTable)

    await db.updateData(SQL_QUERIES.seedData.insertRecipes)
    await db.updateData(SQL_QUERIES.seedData.insertIngredients)
    await db.updateData(SQL_QUERIES.seedData.insertRecipesIngredients)
}

const executeSeeding = () => seedDb(db)

export default executeSeeding