import { SetMetadata } from '@nestjs/common';
import { VIP_LEVEL_KEY } from '../constants';

export const RequireVipLevel = (level: number) =>
  SetMetadata(VIP_LEVEL_KEY, level);
