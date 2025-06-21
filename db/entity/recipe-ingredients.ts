import { Column, PrimaryGeneratedColumn } from "typeorm";

export class RecipeIngredients {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    recipe_id: number

    @Column()
    ingredient_id: number

    @Column('numeric')
    quantity: number
}