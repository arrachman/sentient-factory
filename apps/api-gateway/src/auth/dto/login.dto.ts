import { IsEmail, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({ example: 'adm.medan@fr-labs.my.id', description: 'User email' })
  @IsEmail()
  email!: string;

  @ApiProperty({ example: '12345678', description: 'User password' })
  @IsString()
  @MinLength(8)
  password!: string;
}
