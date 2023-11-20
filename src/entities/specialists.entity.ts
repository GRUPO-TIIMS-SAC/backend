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

  @Column({ length: 15, nullable: false })
  nickname: string;

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

  @ManyToOne(() => Document, (document) => document.id)
  @JoinColumn({ name: 'identity_document', referencedColumnName: 'id' })
  identity_document: number;

  @Column({length:25, nullable: false})
  number_document: string

  @Column({length: 250, nullable: false})
  occupancy: string

  @Column({default: false})
  searching_job: boolean

  @Column({default: false})
  drive_license: boolean

  @Column({type: 'char', length: 1, default: 1})
  work_mode: number

  @Column({length:500})
  cv: string

  @Column({length:500})
  certijoven: string

  @Column({length:500})
  profile_photo: string

  @Column({length: 50, nullable: false})
  auth_strategy: string
}
