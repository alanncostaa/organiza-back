import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
    constructor(private prisma: PrismaService) {}

  // Criar um novo usuário
  async create(createUserDto: CreateUserDto) {
    const hashedPassword = await bcrypt.hash(createUserDto.senha, 10); // Criptografa a senha com um salt de 10

    return await this.prisma.user.create({
      data: {
        nome: createUserDto.nome,
        email: createUserDto.email,
        senha: hashedPassword, // Armazenando a senha criptografada
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
    return bcrypt.compare(plainPassword, hashedPassword); // Compara a senha simples com a criptografada
  }

  // Listar todos os usuários
  async findAll() {
    return this.prisma.user.findMany();
  }

  // Buscar um usuário por ID
  async findOne(id: string) {
    return this.prisma.user.findUnique({
      where: { id: id },
    });
  }

  // Atualizar um usuário
  async update(id: string, updateUserDto: UpdateUserDto) {
    return this.prisma.user.update({
      where: { id: id },
      data: updateUserDto,
    });
  }

  // Deletar um usuário
  async remove(id: string) {
    return this.prisma.user.delete({
      where: { id: id },
    });
  }
}
