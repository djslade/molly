import { BaseEntity } from 'src/database/base.entity';
import { RefreshToken } from 'src/tokens/entities/refresh-token.entity';
import { Entity, OneToMany, OneToOne } from 'typeorm';
import { Credentials } from 'src/credentials/entities/credentials.entity';

@Entity()
export class User extends BaseEntity {
  @OneToMany(() => RefreshToken, (refreshToken) => refreshToken.user)
  refreshTokens: RefreshToken;

  @OneToOne(() => Credentials, (credentials) => credentials.user)
  credentials: Credentials;
}
