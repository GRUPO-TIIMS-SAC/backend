import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'extra_documents' })
export class ExtraDocument {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({nullable: false})
    user_id: number;

    @Column({nullable: false})
    document_id: number;

    @Column({ length: 2500, nullable: false})
    url: string;
}