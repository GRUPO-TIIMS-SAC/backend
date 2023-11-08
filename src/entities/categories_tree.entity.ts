import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn, PrimaryGeneratedColumn, Unique } from "typeorm";
import { Category } from "src/entities/categories.entity";

@Entity({name: 'categories_tree'})
@Unique('unique_combination', ['father', 'id_category'])
export class CategoryTree{

    @PrimaryGeneratedColumn()
    id: number

    @ManyToOne(() => Category, { eager: true })
    @JoinColumn({name: 'father', referencedColumnName: 'id'})
    father: Category

    @ManyToOne(() => Category, { eager: true })
    @JoinColumn({name: 'id_category', referencedColumnName: 'id'})
    id_category: Category
}