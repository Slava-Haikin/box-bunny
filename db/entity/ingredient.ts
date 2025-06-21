import { Column, Entity, PrimaryGeneratedColumn } from "typeorm"

@Entity()
export class Ingredient {
    @PrimaryGeneratedColumn()
    id: number

    @Column('text')
    original: string

    @Column('text')
    name: string    

    @Column('varchar')
    unit: string

    @Column('varchar')
    short_unit: string

    @Column('text')
    long_unit: string

    @Column('text', { array: true })
    possible_units: string[]

    @Column('numeric')
    estimated_cost_value: number

    @Column('varchar')
    estimated_cost_unit: string

    @Column()
    consistency: string

    @Column()
    consistency: string

    @Column()
    shopping_list_units: string

    @Column('varchar')
    aisle: string

    @Column('text')
    image_url: string
}