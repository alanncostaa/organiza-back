import { IsString, IsEmail, IsOptional, IsDate, IsNumber} from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  nome?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  senha?: string;

  @IsOptional()
  @IsString()
  telefone?: string;

  @IsOptional()
  @IsNumber()
  receita?: number;

  @IsOptional()
  @IsNumber()
  meta?: number;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  d_nas?: Date;
}