import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { SubSpeciality } from './subspecialities.entity';
import { Unit } from './units.entity';

@Entity({ name: 'units_subspecialist' })
export class UnitSubspecialist {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToMany(() => SubSpeciality, (subspeciality) => subspeciality.id)
  @JoinColumn({ name: 'subspeciality_id' })
  @Column({ nullable: false })
  subspeciality_id: number;

  @ManyToOne(() => Unit, (unit) => unit.id)
  @JoinColumn({ name: 'unit_id' })
  @Column({ nullable: false })
  unit_id: number;
}
