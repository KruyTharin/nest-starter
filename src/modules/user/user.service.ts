import { PrismaService } from '@/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UserService {
  constructor(private readonly prismaService: PrismaService) {}

  async createUser(createUserDto: CreateUserDto) {
    const { password: _password, ...userData } = createUserDto;

    const response = await this.prismaService.user.create({
      data: userData,
    });

    return response;
  }
}
