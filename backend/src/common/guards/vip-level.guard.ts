import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { VIP_LEVEL_KEY, VIP_LEVEL_NAMES } from '../constants';

@Injectable()
export class VipLevelGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredLevel = this.reflector.getAllAndOverride<number>(
      VIP_LEVEL_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredLevel) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      throw new ForbiddenException('請先登入');
    }

    if (user.vipLevel < requiredLevel) {
      const requiredName = VIP_LEVEL_NAMES[requiredLevel] || `VIP ${requiredLevel}`;
      throw new ForbiddenException(
        `此功能需要 ${requiredName} 等級以上才能使用`,
      );
    }

    return true;
  }
}
