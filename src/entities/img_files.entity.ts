import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'imgs_files' })
export class ImgsFiles {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({length: 50 ,nullable: false})
    image: string;

    @Column({length: 250 ,nullable: false})
    url: string;
}