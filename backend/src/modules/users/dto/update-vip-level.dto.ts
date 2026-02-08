import { IsInt, Min, Max } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateVipLevelDto {
  @ApiProperty({
    description: 'VIP 等級 (1-6)',
    example: 3,
    minimum: 1,
    maximum: 6,
  })
  @IsInt({ message: 'VIP 等級必須為整數' })
  @Min(1, { message: 'VIP 等級最低為 1' })
  @Max(6, { message: 'VIP 等級最高為 6' })
  vipLevel: number;
}
