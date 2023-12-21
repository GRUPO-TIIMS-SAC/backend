import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    Unique,
  } from 'typeorm';
  
  @Entity({ name: 'profiles' })
  export class User {
    @PrimaryGeneratedColumn()
    id: number;
  
    @Column({nullable: false})
    user_id: number;
  
    @Column({ length: 75, nullable: false })
    fullname: string;
  
    @Column({ length: 12, nullable: true })
    phone: string;
  
    @Column({ length: 50, nullable: false })
    addres: string;

    @Column({ length: 25, nullable: false})
    district: string;

    @Column({ length: 25, nullable: false})
    province: string;

    @Column({ length: 25, nullable: false})
    department: string;

    @Column({nullable: false})
    gender_id: number;

    @Column({nullable: false})
    nationality_id: number;
    
    @Column({type: 'char', length: 1, nullable: false})
    type: string;

    @Column({ length: 2500, nullable: true})
    profile_photo: string;

    @Column({type: 'int',nullable: false})
    age: number;

    @Column({nullable: false})
    document_id: number;

    @Column({ length: 35, nullable: false})
    number_document: string;
}