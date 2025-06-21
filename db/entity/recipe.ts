import { COOKING_DIFFICULTY, MEAL, RecipeTag } from "@/types"
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm"

@Entity()
export class Recipe {
    @PrimaryGeneratedColumn()
    id: number

    @Column('text')
    name: string

    @Column('text')
    description: string    

    @Column('text', { array: true })
    instructions: string[]

    @Column('enum', { enum: MEAL })
    meal: MEAL

    @Column('enum', { enum: COOKING_DIFFICULTY })
    difficulty: COOKING_DIFFICULTY

    @Column('integer')
    cook_time_in_minutes: number

    @Column('integer')
    servings: number

    @Column('text')
    image_url: string

    @Column('enum', { enum: RecipeTag, array: true })
    tags: RecipeTag[]
}