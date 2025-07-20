import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto'; // Para gerar um token de recuperação único
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class UserService {
    constructor(private prisma: PrismaService,private mailerService: MailerService,) {}
    async sendPasswordRecoveryEmail(email: string) {
    const user = await this.findOneByEmail(email);
    if (!user) {
      throw new Error('Usuário não encontrado');
    }

    // Gera um token único de recuperação
    const recoveryToken = crypto.randomBytes(20).toString('hex');
    const tokenExpiration = new Date();
    tokenExpiration.setHours(tokenExpiration.getHours() + 1); // O token expira em 1 hora

    // Atualiza o usuário com o token de recuperação e a data de expiração
    await this.prisma.user.update({
      where: { email },
      data: {
        recoveryToken,
        recoveryTokenExpires: tokenExpiration,
      },
    });

    // Envia o email com o link de recuperação
    const recoveryLink = `http://localhost:3000/reset-password?token=${recoveryToken}`;
    await this.mailerService.sendMail({
      to: email,
      subject: 'Recuperação de Senha',
      text: `Clique aqui para redefinir sua senha: ${recoveryLink}`,
    });

    return { message: 'Instruções de recuperação enviadas para seu email.' };
  }

  // Função para verificar o token de recuperação e permitir a alteração de senha
  async resetPassword(token: string, newPassword: string) {
    const user = await this.prisma.user.findFirst({
      where: {
        recoveryToken: token,
        recoveryTokenExpires: {
          gte: new Date(), // Verifica se o token ainda é válido
        },
      },
    });

    if (!user) {
      throw new Error('Token inválido ou expirado');
    }

    // Criptografa a nova senha
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Atualiza a senha do usuário
    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        senha: hashedPassword,
        recoveryToken: null, // Limpa o token após a recuperação
        recoveryTokenExpires: null, // Limpa a data de expiração
      },
    });

    return { message: 'Senha alterada com sucesso.' };
  }

  async create(createUserDto: CreateUserDto) {
    const hashedPassword = await bcrypt.hash(createUserDto.senha, 10); // Criptografa a senha com um salt de 10

    return await this.prisma.user.create({
      data: {
        nome: createUserDto.nome,
        email: createUserDto.email,
        senha: hashedPassword, 
        telefone: createUserDto.telefone,
        receita: createUserDto.receita,
        meta: createUserDto.meta,
        d_nas: createUserDto.d_nas,
      },
    });
  }
  async findOneByEmail(email: string) {
    return this.prisma.user.findFirst({
      where: { email },
    });
  }

  async comparePassword(plainPassword: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(plainPassword, hashedPassword); 
  }

  async findAll() {
    return this.prisma.user.findMany();
  }

  async findOne(id: string) {
    return this.prisma.user.findUnique({
      where: { id: id },
    });
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    return this.prisma.user.update({
      where: { id: id },
      data: updateUserDto,
    });
  }

  async remove(id: string) {
    return this.prisma.user.delete({
      where: { id: id },
    });
  }
}
