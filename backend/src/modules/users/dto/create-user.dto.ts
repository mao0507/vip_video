import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsEmail,
  IsInt,
  IsBoolean,
  MinLength,
  MaxLength,
  Min,
  Max,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({
    description: '使用者名稱',
    example: 'newuser',
    minLength: 3,
    maxLength: 50,
  })
  @IsString()
  @IsNotEmpty({ message: '使用者名稱不能為空' })
  @MinLength(3, { message: '使用者名稱至少需要 3 個字元' })
  @MaxLength(50, { message: '使用者名稱不能超過 50 個字元' })
  username: string;

  @ApiProperty({
    description: '密碼',
    example: 'password123',
    minLength: 6,
  })
  @IsString()
  @IsNotEmpty({ message: '密碼不能為空' })
  @MinLength(6, { message: '密碼至少需要 6 個字元' })
  password: string;

  @ApiPropertyOptional({
    description: '電子郵件',
    example: 'user@example.com',
  })
  @IsOptional()
  @IsEmail({}, { message: '請輸入有效的電子郵件' })
  email?: string;

  @ApiPropertyOptional({
    description: 'VIP 等級 (1-6)',
    example: 1,
    minimum: 1,
    maximum: 6,
    default: 1,
  })
  @IsOptional()
  @IsInt({ message: 'VIP 等級必須為整數' })
  @Min(1, { message: 'VIP 等級最低為 1' })
  @Max(6, { message: 'VIP 等級最高為 6' })
  vipLevel?: number;

  @ApiPropertyOptional({
    description: '是否為管理員',
    example: false,
    default: false,
  })
  @IsOptional()
  @IsBoolean({ message: '管理員欄位必須為布林值' })
  isAdmin?: boolean;
}
