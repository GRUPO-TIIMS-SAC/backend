import { Field } from 'mysql2';
import { Column, Entity, JoinColumn, PrimaryGeneratedColumn } from 'typeorm';

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

  @JoinColumn({ name: 'field', referencedColumnName: 'id' })
  field: Field

  @Column({ length: 500})
  profile_photo: string
}
