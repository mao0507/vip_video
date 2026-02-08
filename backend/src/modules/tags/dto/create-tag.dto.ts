import { ApiProperty } from '@nestjs/swagger';
import { IsString, MaxLength } from 'class-validator';

export class CreateTagDto {
  @ApiProperty({ description: '標籤名稱', maxLength: 50 })
  @IsString()
  @MaxLength(50)
  name: string;
}
