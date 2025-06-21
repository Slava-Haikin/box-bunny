import { DataSource } from 'typeorm';
import { Recipe } from './entity/recipe';
import { Ingredient } from './entity/ingredient';
import { RecipeIngredients } from './entity/recipe-ingredients';

export const AppDataSource = new DataSource({
    type: "postgres",
    host: "localhost",
    port: 5432,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_HOST,
    synchronize: true,
    logging: true,
    entities: [Recipe, Ingredient, RecipeIngredients],
    subscribers: [],
    migrations: [],
})

AppDataSource.initialize()
    .then(() => console.log('DB connected!'))
    .catch((error) => console.error(error))