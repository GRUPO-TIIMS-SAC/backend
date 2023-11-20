import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  Unique,
} from 'typeorm';
import { Document } from 'src/entities/document.entity';

@Entity({ name: 'users' })
@Unique('unique_combination', ['identity_document', 'number_document'])
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  id_auth: number;

  @Column({ length: 250, nullable: false })
  name: string;

  @Column({ length: 25, nullable: false })
  phone: string;

  @Column({ length: 100, nullable: false })
  email: string;

  @Column({ length: 250, nullable: false })
  address: string;

  @Column({ length: 25, nullable: false })
  country: string;

  @Column({ length: 25, nullable: false })
  region: string;

  @Column({ length: 25, nullable: false })
  district: string;

  @ManyToOne(() => Document, (document) => document.id, {eager: true})
  @JoinColumn({ name: 'identity_document', referencedColumnName: 'id' })
  identity_document: number;
 
  @Column({ length: 25, nullable: false })
  number_document: string;

  @Column({ length: 500 })
  profile_photo: string;

  @Column({ length: 50 })
  auth_strategy: string;
}
