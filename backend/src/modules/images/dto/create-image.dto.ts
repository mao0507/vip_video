import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  IsInt,
  IsBoolean,
  MaxLength,
  Min,
  Max,
} from 'class-validator';

export class CreateImageDto {
  @ApiProperty({ description: '圖片標題', maxLength: 200 })
  @IsString()
  @MaxLength(200)
  title: string;

  @ApiPropertyOptional({ description: '圖片描述' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ description: '圖片網址' })
  @IsString()
  imageUrl: string;

  @ApiPropertyOptional({ description: '縮圖網址' })
  @IsOptional()
  @IsString()
  thumbnailUrl?: string;

  @ApiPropertyOptional({ description: '需要的 VIP 等級', default: 5, minimum: 1, maximum: 6 })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(6)
  requiredVipLevel?: number;

  @ApiPropertyOptional({ description: '是否啟用', default: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
