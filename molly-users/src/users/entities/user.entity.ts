import { Credentials } from 'src/credentials/entities/credentials.entity';
import { BaseEntity } from 'src/database/base.entity';
import { RefreshToken } from 'src/tokens/entities/refresh-token.entity';
import { Column, Entity, OneToMany, OneToOne } from 'typeorm';

@Entity()
export class User extends BaseEntity {
  @Column({ unique: true })
  email: string;

  @Column()
  hashedPassword: string;

  @OneToMany(() => RefreshToken, (refreshToken) => refreshToken.user)
  refreshTokens: RefreshToken[];

  @OneToOne(() => Credentials, (credentials) => credentials.user)
  credentials: Credentials;
}
