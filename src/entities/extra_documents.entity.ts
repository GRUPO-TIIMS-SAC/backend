import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Document } from "./documents.entity";
import { User } from "./user.entity";

@Entity({ name: 'extra_documents' })
export class ExtraDocument {

    @PrimaryGeneratedColumn()
    id: number;

    @OneToMany(() => User, user => user.id)
    @JoinColumn({name: 'user_id'})
    @Column({nullable: false})
    user_id: number;

    @ManyToOne(() => Document, document => document.id)
    @JoinColumn({name: 'document_id'})
    @Column({nullable: false})
    document_id: number;

    @Column({ length: 2500, nullable: false})
    url: string;
}