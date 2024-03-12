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

  @ManyToOne(() => User, (user) => user.id)
  @JoinColumn({ name: 'user_id' })
  @Column({ nullable: false })
  user_id: number;

  @ManyToOne(() => Service, (service) => service.id)
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

  @Column({type: 'double', nullable: false })
  amount: number;

  @Column({ length: 8, nullable: false })
  code_service: string;

  @Column({ type: 'timestamp', nullable: false })
  date_service: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP'})
  created_at: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP'})
  updated_at: Date;

  @Column({ length: 100, nullable: false })
  address: string;

  @Column({ length: 50, nullable: false })
  district: string;

  @Column({ type: 'double', nullable: true })
  longitude: number;

  @Column({ type: 'double', nullable: true })
  latitude: number;

  @Column({ nullable: true })
  bill: boolean;

  @ManyToOne(() => User, user => user.id)
  @JoinColumn({name: 'user_id'})
  user: User;

  @ManyToOne(() => Service, service => service.id)
  @JoinColumn({name: 'service_id'})
  service: Service;
}
