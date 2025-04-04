import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { CreateUserRequestDto } from './dtos/createUserRequest.dt';
import * as bcrypt from 'bcrypt';
import { RefreshToken } from './entities/refreshToken.entity';
import { addDays } from 'date-fns';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(RefreshToken)
    private readonly refreshTokenRepository: Repository<RefreshToken>,
  ) {}

  private async hashPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, await bcrypt.genSalt());
  }

  async createUser(createUserRequestDto: CreateUserRequestDto): Promise<User> {
    const user: User = new User();

    user.email = createUserRequestDto.email;
    user.hashedPassword = await this.hashPassword(
      createUserRequestDto.password,
    );

    return await this.userRepository.save(user);
  }

  async createRefreshToken(): Promise<RefreshToken> {
    const refreshToken: RefreshToken = new RefreshToken();

    refreshToken.expired = addDays(new Date(), 60);

    return await this.refreshTokenRepository.save(refreshToken);
  }
}
