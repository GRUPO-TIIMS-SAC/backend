import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import {Document} from 'src/entities/document.entity'

@Entity({ name: 'specialists' })
@Unique('unique_combination', ['identity_document', 'number_document'])
export class Specialist {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 15 })
  nickname: string;

  @Column({ length: 250 })
  name: string;

  @Column({ length: 25 })
  phone: string;

  @Column({ length: 100 })
  email: string;

  @Column({ length: 250 })
  address: string;

  @Column({ length: 25 })
  country: string;

  @Column({ length: 25 })
  region: string;

  @Column({ length: 25 })
  district: string;

  @ManyToOne(() => Document, (document) => document.id)
  @JoinColumn({ name: 'identity_document', referencedColumnName: 'id' })
  identity_document: Document;

  @Column({length:25})
  number_document: string

  @Column({length: 250})
  occupancy: string

  @Column({default: false})
  searching_job: boolean

  @Column({default: false})
  drive_license: boolean

  @Column({type: 'char', length: 1})
  work_mode: number

  @Column({length:500})
  cv: string

  @Column({length:500})
  certijoven: string

  @Column({length:500})
  profile_photo: string

  @Column({length: 50})
  auth_strategy: string
}
