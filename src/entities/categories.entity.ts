import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'categories' })
export class Category {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({length: 50, nullable: false})
  name: string

  @Column({length: 25, nullable: false})
  color: string

  @Column({length: 500})
  image: string

  @Column({type: 'char', length: 1, nullable: false})
  mode: number
}
