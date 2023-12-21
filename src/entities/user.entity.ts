import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Unique,
} from 'typeorm';

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  auth_method_id: number;

  @Column({ length: 32, nullable: false })
  uuid: string;

  @Column({ length: 50, nullable: false, unique: true})
  email: string;

  @Column({ length: 250, nullable: false })
  password: string;

  @Column()
  created_at: Date;
}
