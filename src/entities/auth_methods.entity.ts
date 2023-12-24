import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'auth_methods' })
export class AuthMethod {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 25, nullable: false })
  auth_method: string;
}
