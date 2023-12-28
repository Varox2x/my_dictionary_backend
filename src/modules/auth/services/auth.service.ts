import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuthDto } from '../dto';
import { JwtPayload, Tokens } from '../types';
import { User } from '../entities/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    private jwtService: JwtService,
    private config: ConfigService,
  ) {}

  async signupLocal(dto: AuthDto): Promise<Tokens> {
    const existingUser = await this.usersRepository.findOne({
      where: [{ email: dto.email }],
    });
    if (existingUser) {
      throw new BadRequestException(['Email jest już zajęty']);
    }

    const newUser = new User();

    newUser.email = dto.email;
    newUser.password = await this.hashData(dto.password);

    const createdUser = await this.usersRepository.save(newUser);

    const tokens = await this.getTokens(createdUser.id, createdUser.email);

    await this.updateRtHash(createdUser.id, tokens.refresh_token);

    return tokens;
  }

  async signinLocal(dto: AuthDto): Promise<Tokens> {
    const user = await this.usersRepository.findOneBy({ email: dto.email });
    if (!user) throw new ForbiddenException('Access Denied');
    const passwordMatches = await bcrypt.compare(dto.password, user.password);
    if (!passwordMatches) throw new ForbiddenException('Access Denied');
    const tokens = await this.getTokens(user.id, user.email);

    await this.updateRtHash(user.id, tokens.refresh_token);

    return tokens;
  }

  async logout(userId: number): Promise<boolean> {
    await this.usersRepository.update({ id: userId }, { token: null });
    return true;
  }

  async refreshTokens(userId: number, rt: string): Promise<Tokens> {
    const user = await this.usersRepository.findOne({ where: { id: userId } });
    if (!user || !user.token) throw new ForbiddenException('Acces Denied');
    const rtMatches = await bcrypt.compare(rt, user.token);
    if (!rtMatches) throw new ForbiddenException('Acces Denied');

    const tokens = await this.getTokens(user.id, user.email);

    await this.updateRtHash(user.id, tokens.refresh_token);

    return tokens;
  }

  async updateRtHash(userId: number, rt: string): Promise<void> {
    const hash = await this.hashData(rt);
    const user = await this.usersRepository.findOneBy({ id: userId });
    user.token = hash;
    await this.usersRepository.save(user);
  }

  async getTokens(userId: number, email: string): Promise<Tokens> {
    const jwtPayload: JwtPayload = {
      sub: userId,
      email: email,
    };

    const [at, rt] = await Promise.all([
      this.jwtService.signAsync(jwtPayload, {
        secret: this.config.get<string>('AT_SECRET'),
        expiresIn: '30s',
      }),
      this.jwtService.signAsync(jwtPayload, {
        secret: this.config.get<string>('RT_SECRET'),
        expiresIn: '7d',
      }),
    ]);

    return {
      access_token: at,
      refresh_token: rt,
    };
  }

  public async hashData(password: string): Promise<string> {
    return await bcrypt.hash(password, 10);
  }
}
