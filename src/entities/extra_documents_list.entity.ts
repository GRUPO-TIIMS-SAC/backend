import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'extra_documents_list' })
export class ExtraDocumentList {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({length: 25 ,nullable: false})
    document: string;
}