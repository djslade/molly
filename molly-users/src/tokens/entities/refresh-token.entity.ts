import { User } from 'src/users/entities/user.entity';
import { BaseEntity } from '../../database/base.entity';
import { Column, Entity, ManyToOne } from 'typeorm';

@Entity()
export class RefreshToken extends BaseEntity {
  @ManyToOne(() => User, (user) => user.refreshTokens)
  user: User;

  @Column('date')
  expiresAt: Date;
}
