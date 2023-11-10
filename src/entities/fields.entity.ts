import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'fields' })
export class Field {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 50, unique: true })
  field: string;
}
