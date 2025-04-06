import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { CreateUserRequestDto } from './dtos/createUserRequest.dto';
import * as bcrypt from 'bcrypt';
import { RefreshToken } from './entities/refreshToken.entity';
import { addDays } from 'date-fns';
import { CreateRefreshTokenRequestDto } from './dtos/createRefreshTokenRequest.dto';
import { RpcException } from '@nestjs/microservices';
import { status as grpcStatus } from '@grpc/grpc-js';

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

  async createRefreshToken(
    createRefreshTokenDto: CreateRefreshTokenRequestDto,
  ): Promise<RefreshToken> {
    const user: User | null = await this.userRepository.findOne({
      where: { email: createRefreshTokenDto.email },
    });
    if (user === null) {
      throw new RpcException({ code: grpcStatus.NOT_FOUND });
    }
    const passwordMatches = await bcrypt.compare(
      createRefreshTokenDto.password,
      user.hashedPassword,
    );
    if (!passwordMatches) {
      throw new RpcException({ code: 6 });
    }
    const refreshToken: RefreshToken = new RefreshToken();

    refreshToken.userId = user.id;
    const expired = addDays(new Date(), 60);
    refreshToken.expired = expired;

    return await this.refreshTokenRepository.save(refreshToken);
  }
}
