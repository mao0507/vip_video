import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  IsInt,
  IsBoolean,
  IsUUID,
  IsArray,
  MaxLength,
  Min,
  Max,
} from 'class-validator';

export class CreateVideoDto {
  @ApiProperty({ description: '影片標題', maxLength: 200 })
  @IsString()
  @MaxLength(200)
  title: string;

  @ApiPropertyOptional({ description: '影片描述' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ description: '影片網址' })
  @IsString()
  videoUrl: string;

  @ApiPropertyOptional({ description: '縮圖網址' })
  @IsOptional()
  @IsString()
  thumbnailUrl?: string;

  @ApiPropertyOptional({ description: '影片時長（秒）', default: 0 })
  @IsOptional()
  @IsInt()
  @Min(0)
  duration?: number;

  @ApiPropertyOptional({ description: '試看時長（秒）', default: 60 })
  @IsOptional()
  @IsInt()
  @Min(0)
  previewDuration?: number;

  @ApiPropertyOptional({ description: '需要的 VIP 等級', default: 1, minimum: 1, maximum: 6 })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(6)
  requiredVipLevel?: number;

  @ApiPropertyOptional({ description: '分類 ID' })
  @IsOptional()
  @IsUUID()
  categoryId?: string;

  @ApiPropertyOptional({ description: '標籤 ID 列表' })
  @IsOptional()
  @IsArray()
  @IsUUID('4', { each: true })
  tagIds?: string[];

  @ApiPropertyOptional({ description: '是否啟用', default: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
