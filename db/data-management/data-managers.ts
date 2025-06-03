import { DatabaseConnector } from "../connection/db-connector";

export class RecipeManager {
    constructor(private db: DatabaseConnector) {}

    async getAllRecipes () {
        return this.db.readData('SELECT * FROM recipes');
    }

    async saveRecipe() {}
}