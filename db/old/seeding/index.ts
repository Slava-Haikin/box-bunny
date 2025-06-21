import { DatabaseConnector, db } from "../source"
import SQL_QUERIES from "../../queries"

let seeded = false

const seedDb = async (db: DatabaseConnector): Promise<void> => {
    if (!seeded) {
        await db.checkConnection()

        await db.updateData(SQL_QUERIES.seedData.createRecipesTable)
        await db.updateData(SQL_QUERIES.seedData.createIngredientsTable)
        await db.updateData(SQL_QUERIES.seedData.createRecipesIngredientsTable)

        await db.updateData(SQL_QUERIES.seedData.insertRecipes)
        await db.updateData(SQL_QUERIES.seedData.insertIngredients)
        await db.updateData(SQL_QUERIES.seedData.insertRecipesIngredients)

        seeded = true
    }
}

const seedData = () => seedDb(db)

export default seedData