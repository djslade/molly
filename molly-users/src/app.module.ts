import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './users/entities/user.entity';
import { RefreshToken } from './users/entities/refreshToken.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      password: 'postgres',
      username: 'postgres',
      entities: [User, RefreshToken],
      database: 'molly_users',
      synchronize: true,
      logging: true,
    }),
    UsersModule,
  ],
})
export class AppModule {}
