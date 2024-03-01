import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    Unique,
    ManyToMany,
    ManyToOne,
    JoinColumn,
    OneToMany,
    OneToOne,
  } from 'typeorm';
import { Gender } from './genders.entity';
import { Nationality } from './nacionalities.entity';
import { Document } from './documents.entity';
import { User } from './user.entity';
  
  @Entity({ name: 'profiles' })
  export class Profile {
    @PrimaryGeneratedColumn()
    id: number;
  
    @OneToOne(() => User, user => user.id)
    @JoinColumn({name: 'user_id'})  
    @Column({nullable: false})
    user_id: number;
    
    @Column({ length: 12, nullable: true })
    phone: string;
  
    @Column({ length: 50, nullable: false })
    address: string;

    @Column({ length: 25, nullable: false})
    district: string;

    @Column({ length: 25, nullable: false})
    province: string;

    @Column({ length: 25, nullable: false})
    department: string;

    @ManyToOne(() => Gender, gender => gender.id)
    @JoinColumn({name:'gender_id'})
    @Column({nullable: false})
    gender_id: number;

    @ManyToOne(() => Nationality, nationality => nationality.id)
    @JoinColumn({name:'nationality_id'})
    @Column({nullable: false})
    nationality_id: number;
    
    @Column({type: 'char', length: 1, nullable: false, default: '0'})
    type: string;

    @Column({ length: 2500, nullable: true})
    profile_photo: string;

    @Column({nullable: false})
    born_date: Date;

    @ManyToOne(() => Document, document => document.id)
    @JoinColumn({name:'document_id'})
    @Column({nullable: false})
    document_id: number;

    @Column({ length: 35, nullable: false})
    number_document: string;

    @Column({ length: 40, nullable: true})
    occupancy: string;

    @Column({ type: 'char', length: 1, nullable: true})
    work_mode: string;

    @Column({ length: 250, nullable: true})
    own_description: string;

    @ManyToOne(() => Gender, gender => gender.id)
    @JoinColumn({name:'gender_id'})
    gender: Gender;

    @ManyToOne(() => Nationality, nationality => nationality.id)
    @JoinColumn({name:'nationality_id'})
    nationality: Nationality;
}