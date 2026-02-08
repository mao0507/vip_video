import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { User, RefreshToken } from '../../entities';
import { LoginDto, RefreshTokenDto } from './dto';
import { JwtPayload } from './strategies/jwt.strategy';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(RefreshToken)
    private readonly refreshTokenRepository: Repository<RefreshToken>,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async login(loginDto: LoginDto) {
    const { username, password } = loginDto;

    const user = await this.userRepository.findOne({
      where: { username, isActive: true },
    });

    if (!user) {
      throw new UnauthorizedException('使用者名稱或密碼錯誤');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('使用者名稱或密碼錯誤');
    }

    const tokens = await this.generateTokens(user);

    return {
      user: {
        id: user.id,
        username: user.username,
        vipLevel: user.vipLevel,
        isAdmin: user.isAdmin,
      },
      ...tokens,
    };
  }

  async logout(userId: string, refreshToken?: string) {
    if (refreshToken) {
      const tokenHash = this.hashToken(refreshToken);
      await this.refreshTokenRepository.update(
        { userId, tokenHash },
        { isRevoked: true },
      );
    } else {
      await this.refreshTokenRepository.update(
        { userId, isRevoked: false },
        { isRevoked: true },
      );
    }

    return { message: '登出成功' };
  }

  async refreshTokens(refreshTokenDto: RefreshTokenDto) {
    const { refreshToken } = refreshTokenDto;

    try {
      const payload = this.jwtService.verify(refreshToken, {
        secret: this.configService.get<string>('jwt.refreshSecret'),
      });

      const tokenHash = this.hashToken(refreshToken);
      const storedToken = await this.refreshTokenRepository.findOne({
        where: { tokenHash, userId: payload.sub, isRevoked: false },
      });

      if (!storedToken) {
        throw new UnauthorizedException('無效的 Refresh Token');
      }

      if (storedToken.expiresAt < new Date()) {
        throw new UnauthorizedException('Refresh Token 已過期');
      }

      const user = await this.userRepository.findOne({
        where: { id: payload.sub, isActive: true },
      });

      if (!user) {
        throw new UnauthorizedException('使用者不存在或已停用');
      }

      await this.refreshTokenRepository.update(storedToken.id, {
        isRevoked: true,
      });

      const tokens = await this.generateTokens(user);

      return {
        user: {
          id: user.id,
          username: user.username,
          vipLevel: user.vipLevel,
          isAdmin: user.isAdmin,
        },
        ...tokens,
      };
    } catch {
      throw new BadRequestException('無效的 Refresh Token');
    }
  }

  private async generateTokens(user: User) {
    const payload: JwtPayload = {
      sub: user.id,
      username: user.username,
      vipLevel: user.vipLevel,
      isAdmin: user.isAdmin,
    };

    const accessToken = this.jwtService.sign(payload);

    const refreshSecret =
      this.configService.get<string>('jwt.refreshSecret') || 'default_refresh';
    const refreshExpiresIn =
      this.configService.get<string>('jwt.refreshExpiresIn') || '30d';

    const signOptions: JwtSignOptions = {
      secret: refreshSecret,
      expiresIn: this.parseExpiresIn(refreshExpiresIn),
    };

    const refreshToken = this.jwtService.sign(payload, signOptions);

    const tokenHash = this.hashToken(refreshToken);
    const expiresAt = this.calculateExpiryDate(refreshExpiresIn);

    await this.refreshTokenRepository.save({
      tokenHash,
      userId: user.id,
      expiresAt,
    });

    return {
      accessToken,
      refreshToken,
    };
  }

  private parseExpiresIn(expiresIn: string): number {
    const match = expiresIn.match(/^(\d+)([dhms])$/);
    if (!match) {
      return 30 * 24 * 60 * 60; // 30 days in seconds
    }

    const value = parseInt(match[1], 10);
    const unit = match[2];

    switch (unit) {
      case 'd':
        return value * 24 * 60 * 60;
      case 'h':
        return value * 60 * 60;
      case 'm':
        return value * 60;
      case 's':
        return value;
      default:
        return 30 * 24 * 60 * 60;
    }
  }

  private hashToken(token: string): string {
    return crypto.createHash('sha256').update(token).digest('hex');
  }

  private calculateExpiryDate(expiresIn: string): Date {
    const seconds = this.parseExpiresIn(expiresIn);
    return new Date(Date.now() + seconds * 1000);
  }
}
