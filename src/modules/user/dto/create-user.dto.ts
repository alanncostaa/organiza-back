import { IsString, IsEmail, IsNumber, IsDateString } from 'class-validator';

export class CreateUserDto {
  @IsString()
  nome: string;

  @IsEmail()
  email: string;

  @IsString()
  senha: string;

  @IsString()
  telefone: string;

  @IsNumber()
  receita: number;

  @IsNumber()
  meta: number;

  @IsDateString()
  d_nas: Date;
}