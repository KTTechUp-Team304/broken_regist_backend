import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { createHash, randomUUID } from 'node:crypto';
import type { StringValue } from 'ms';
import { Repository } from 'typeorm';
import { User, UserRole } from '../users/entities/user.entity';
import { LoginDto, RegisterDto } from './dto';
import { RefreshToken } from './entities/refresh-token.entity';

type PublicUser = Pick<User, 'id' | 'username' | 'role' | 'createdAt'>;
type AuthTokens = {
  accessToken: string;
  refreshToken: string;
};

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    @InjectRepository(RefreshToken)
    private readonly refreshTokensRepository: Repository<RefreshToken>,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async register(dto: RegisterDto): Promise<PublicUser> {
    const existing = await this.usersRepository.findOne({
      where: { username: dto.username },
    });

    if (existing) {
      throw new ConflictException('Username already exists');
    }

    const createdUser = this.usersRepository.create({
      username: dto.username,
      passwordHash: this.hashValue(dto.passwordHash),
      role: dto.role ?? UserRole.STUDENT,
    });

    const savedUser = await this.usersRepository.save(createdUser);
    return this.toPublicUser(savedUser);
  }

  async login(
    dto: LoginDto,
    deviceInfo?: string,
  ): Promise<PublicUser & AuthTokens> {
    const user = await this.usersRepository.findOne({
      where: { username: dto.username },
    });

    if (!user || user.passwordHash !== this.hashValue(dto.passwordHash)) {
      throw new UnauthorizedException('Invalid username or password');
    }

    const tokens = await this.issueTokens(user, deviceInfo);
    return {
      ...this.toPublicUser(user),
      ...tokens,
    };
  }

  async refresh(refreshToken: string): Promise<{ accessToken: string }> {
    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token is required');
    }

    const payload = await this.verifyToken(refreshToken, true);
    const tokenRecord = await this.refreshTokensRepository.findOne({
      where: {
        userId: payload.sub,
        tokenHash: this.hashValue(refreshToken),
      },
    });

    if (!tokenRecord || tokenRecord.revokedAt) {
      throw new UnauthorizedException('Refresh token is revoked');
    }

    if (tokenRecord.expiresAt < new Date()) {
      throw new UnauthorizedException('Refresh token is expired');
    }

    return {
      accessToken: await this.signAccessToken(
        payload.sub,
        payload.username,
        payload.role,
      ),
    };
  }

  async logout(
    userId: number,
    refreshToken?: string,
  ): Promise<{ success: boolean }> {
    if (!refreshToken) {
      return { success: true };
    }

    const tokenRecord = await this.refreshTokensRepository.findOne({
      where: {
        userId,
        tokenHash: this.hashValue(refreshToken),
      },
    });

    if (!tokenRecord || tokenRecord.revokedAt) {
      return { success: true };
    }

    tokenRecord.revokedAt = new Date();
    await this.refreshTokensRepository.save(tokenRecord);
    return { success: true };
  }

  async me(userId: number): Promise<PublicUser> {
    const user = await this.usersRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    return this.toPublicUser(user);
  }

  async verifyAccessToken(token: string): Promise<{
    sub: number;
    username: string;
    role: UserRole;
  }> {
    return this.verifyToken(token, false);
  }

  private async issueTokens(
    user: User,
    deviceInfo?: string,
  ): Promise<AuthTokens> {
    const accessToken = await this.signAccessToken(
      user.id,
      user.username,
      user.role,
    );
    const refreshToken = await this.signRefreshToken(
      user.id,
      user.username,
      user.role,
    );

    const refreshRecord = this.refreshTokensRepository.create({
      userId: user.id,
      tokenHash: this.hashValue(refreshToken),
      issuedAt: new Date(),
      expiresAt: this.createRefreshExpiryDate(),
      revokedAt: null,
      deviceInfo: deviceInfo ?? null,
    });
    await this.refreshTokensRepository.save(refreshRecord);

    return { accessToken, refreshToken };
  }

  private async signAccessToken(
    userId: number,
    username: string,
    role: UserRole,
  ): Promise<string> {
    return this.jwtService.signAsync(
      { sub: userId, username, role, tokenType: 'access' },
      {
        secret: this.configService.get<string>(
          'JWT_ACCESS_SECRET',
          'dev-access-secret',
        ),
        expiresIn: this.configService.get<string>(
          'JWT_ACCESS_EXPIRES_IN',
          '15m',
        ) as StringValue,
        jwtid: randomUUID(),
      },
    );
  }

  private async signRefreshToken(
    userId: number,
    username: string,
    role: UserRole,
  ): Promise<string> {
    return this.jwtService.signAsync(
      { sub: userId, username, role, tokenType: 'refresh' },
      {
        secret: this.configService.get<string>(
          'JWT_REFRESH_SECRET',
          'dev-refresh-secret',
        ),
        expiresIn: this.configService.get<string>(
          'JWT_REFRESH_EXPIRES_IN',
          '7d',
        ) as StringValue,
        jwtid: randomUUID(),
      },
    );
  }

  private async verifyToken(
    token: string,
    isRefreshToken: boolean,
  ): Promise<{
    sub: number;
    username: string;
    role: UserRole;
    tokenType: string;
  }> {
    try {
      return await this.jwtService.verifyAsync(token, {
        secret: this.configService.get<string>(
          isRefreshToken ? 'JWT_REFRESH_SECRET' : 'JWT_ACCESS_SECRET',
          isRefreshToken ? 'dev-refresh-secret' : 'dev-access-secret',
        ),
      });
    } catch {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }

  private hashValue(value: string): string {
    return createHash('sha256').update(value).digest('hex');
  }

  private toPublicUser(user: User): PublicUser {
    return {
      id: user.id,
      username: user.username,
      role: user.role,
      createdAt: user.createdAt,
    };
  }

  private createRefreshExpiryDate(): Date {
    const expiresInDays = Number(
      this.configService.get<string>('JWT_REFRESH_EXPIRES_DAYS', '7'),
    );
    const date = new Date();
    date.setDate(date.getDate() + expiresInDays);
    return date;
  }
}
