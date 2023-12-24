import { Column, Entity, JoinColumn, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './user.entity';
import { Speciality } from './specialities.entity';

@Entity({ name: 'specialists' })
export class Specialist {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToMany(() => User, (user) => user.id)
  @JoinColumn({ name: 'user_id' })
  @Column({ nullable: false })
  user_id: number;

  @OneToMany(() => Speciality, (speciality) => speciality.id)
  @JoinColumn({ name: 'speciality_id' })
  @Column({ nullable: false })
  speciality_id: number;
}
