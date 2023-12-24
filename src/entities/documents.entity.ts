import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'documents' })
export class Document {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({length: 25 ,nullable: false})
    document: string;
}