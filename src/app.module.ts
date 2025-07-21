import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MailerModule } from '@nestjs-modules/mailer';
import { TransactionModule } from './modules/transaction/transaction.module';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';

@Module({
  imports: [TransactionModule, UserModule, AuthModule, MailerModule.forRoot({
      transport: {
        host: 'smtp-relay.sendinblue.com', 
        port: 587,
        secure: false,
        auth: {
          user: process.env.USER_SMTP,
          pass: process.env.PAS_SMTP
        },
      },
      defaults: {
        from: '"Não Responda" <organizaapp3@gmail.com>', 
      },
    }),],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
