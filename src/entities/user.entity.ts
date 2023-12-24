import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Unique,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { AuthMethod } from './auth_methods.entity';

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => AuthMethod, (auth_method) => auth_method.id)
  @JoinColumn({ name: 'auth_method_id' })
  @Column()
  auth_method_id: number;

  @Column({ length: 32, nullable: false })
  uuid: string;

  @Column({ length: 50, nullable: false, unique: true})
  email: string;

  @Column({ length: 250, nullable: false })
  password: string;

  @Column({nullable: false, default: false})
  clean_free: boolean;

  @Column()
  created_at: Date;
}
