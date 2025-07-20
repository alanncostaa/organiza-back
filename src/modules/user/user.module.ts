import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { AuthModule } from '../auth/auth.module';

@Module({
    controllers: [UserController],
    providers: [UserService],
    imports: [PrismaModule, AuthModule],
})
export class UserModule {}
