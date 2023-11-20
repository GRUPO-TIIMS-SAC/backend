import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'auth' })
export class Auth {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 50, nullable: false })
  phone: string;

  @Column({ length: 50, nullable: false })
  nickname: string;

  @Column({ length: 2500, nullable: false })
  password: string;
}
