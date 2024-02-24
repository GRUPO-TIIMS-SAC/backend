import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './user.entity';
import { Service } from './services.entity';
import { StatusRequest } from './status_request.entity';
import { Payment } from './payments.entity';
import { Unit } from './units.entity';

@Entity({ name: 'requests' })
export class Request {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToMany(() => User, (user) => user.id)
  @JoinColumn({ name: 'user_id' })
  @Column({ nullable: false })
  user_id: number;

  @OneToMany(() => Service, (service) => service.id)
  @JoinColumn({ name: 'service_id' })
  @Column({ nullable: false })
  service_id: number;

  @ManyToOne(() => StatusRequest, (requests) => requests.id)
  @JoinColumn({ name: 'status_request_id' })
  @Column({ nullable: false })
  status_request_id: number;

  @OneToOne(() => Payment, (payment) => payment.id)
  @JoinColumn({ name: 'payment_id' })
  @Column({ nullable: true })
  payment_id: number;

  @Column({ nullable: false })
  amount: number;

  @Column({ length: 8, nullable: false })
  code_service: string;

  @Column({ nullable: false })
  date_service: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP'})
  created_at: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP'})
  updated_at: Date;

  @Column({ length: 100, nullable: false })
  address: string;

  @Column({ nullable: true })
  bill: boolean;
}
