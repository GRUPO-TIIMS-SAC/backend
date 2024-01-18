import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'tmp_validated_email' })
  export class TmpValidatedEmail {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100, nullable: false,  })
  email: string;

  @Column({ length: 6, nullable: false })
  code: string;

  @Column({ nullable: false })
  email_id: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updated_at: Date;

  @Column({default: 0})
  attempts: number;

  @Column({ default: false, nullable: false})
  is_update: boolean;
}
