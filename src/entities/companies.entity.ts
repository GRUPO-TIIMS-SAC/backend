import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Field } from './fields.entity';

@Entity({ name: 'companies' })
export class Company {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 250, nullable: false })
  social_reason: string

  @Column({ length: 25, nullable: false })
  phone: string

  @Column({ length: 100, nullable: false })
  email: string

  @Column({ length: 250, nullable: false })
  address: string

  @Column({ length: 25, nullable: false })
  country: string

  @Column({ length: 25, nullable: false })
  region: string

  @Column({ length: 25, nullable: false })
  district: string

  @Column({ length: 25, nullable: false, unique: true})
  ruc: string

  @ManyToOne(() => Field, { eager: true })
  @JoinColumn({ name: 'field', referencedColumnName: 'id' })
  field: number

  @Column({ length: 500})
  profile_photo: string
}
