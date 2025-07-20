import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt'; // Importe o JwtModule
import { PassportModule } from '@nestjs/passport'; // Importe o PassportModule
import { JwtStrategy } from './jwt.strategy';
import { PrismaService } from '../prisma/prisma.service';
import { UserService } from '../user/user.service';
@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }), // Registrar a estratégia padrão como 'jwt'
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '1h' }, 
    }),
  ],
  providers: [AuthService, JwtStrategy, PrismaService, UserService], 
  controllers: [AuthController], 
  exports: [JwtStrategy, PassportModule, JwtModule, AuthService],
})
export class AuthModule {}