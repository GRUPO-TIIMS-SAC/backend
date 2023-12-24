import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'status_request' })
export class StatusRequest {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({length: 25 ,nullable: false})
    status: string;
}