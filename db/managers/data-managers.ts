import { DatabaseConnector } from "../source/db-connector";

export class RecipeManager {
    constructor(private db: DatabaseConnector) {}

    async getAllRecipes () {
        return this.db.readData('SELECT * FROM recipes');
    }

    async saveRecipe() {}
}