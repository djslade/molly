import { BaseEntity } from 'src/database/base.entity';
import { User } from 'src/users/entities/user.entity';
import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';

@Entity()
export class Credentials extends BaseEntity {
  @Column({ unique: true })
  email: string;

  @Column()
  hashedPassword: string;

  @OneToOne(() => User, (user) => user.credentials)
  @JoinColumn()
  user: User;
}
