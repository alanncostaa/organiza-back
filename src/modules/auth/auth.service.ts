
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';
import { JwtPayload } from './jwt-payload.interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
  ) {}

  async validateUser(email: string, password: string) {
    const user = await this.userService.findOneByEmail(email);
    if (user && await bcrypt.compare(password, user.senha)) {
      return user; 
    }
    return null; 
  }

  async login(loginDto: LoginDto) {
    const user = await this.validateUser(loginDto.email, loginDto.senha);
    if (!user) {
      throw new Error('Invalid credentials');
    }
    const payload: JwtPayload = { email: user.email, sub: user.id };
    console.log('JWT_SECRET usado na geração:', process.env.JWT_SECRET);
    return {
      
      access_token: this.jwtService.sign(payload),
    };
  }
}
    