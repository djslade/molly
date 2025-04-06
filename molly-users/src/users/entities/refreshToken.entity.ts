import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity()
export class RefreshToken {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, (user) => user.id, { onDelete: 'CASCADE' })
  @Column({ type: 'uuid' })
  userId: string;

  @CreateDateColumn({ type: 'timestamp' })
  created: Date;

  @Column({ type: 'timestamp' })
  expired: Date;
}
