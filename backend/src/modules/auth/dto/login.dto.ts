import { IsString, IsNotEmpty, MinLength, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({
    description: '使用者名稱',
    example: 'admin',
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
    example: 'admin123',
    minLength: 6,
  })
  @IsString()
  @IsNotEmpty({ message: '密碼不能為空' })
  @MinLength(6, { message: '密碼至少需要 6 個字元' })
  password: string;
}
