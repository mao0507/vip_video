import {
  IsString,
  IsOptional,
  IsEmail,
  IsBoolean,
  MinLength,
} from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateUserDto {
  @ApiPropertyOptional({
    description: '密碼',
    example: 'newpassword123',
    minLength: 6,
  })
  @IsOptional()
  @IsString()
  @MinLength(6, { message: '密碼至少需要 6 個字元' })
  password?: string;

  @ApiPropertyOptional({
    description: '電子郵件',
    example: 'newemail@example.com',
  })
  @IsOptional()
  @IsEmail({}, { message: '請輸入有效的電子郵件' })
  email?: string;

  @ApiPropertyOptional({
    description: '是否啟用',
    example: true,
  })
  @IsOptional()
  @IsBoolean({ message: '啟用欄位必須為布林值' })
  isActive?: boolean;
}
