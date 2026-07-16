import { HTTP_CLIENT } from '@/common/http/http.tokens';
import { HttpClient } from '@/common/http/http.types';
import { PrismaService } from '@/prisma/prisma.service';
import { BadGatewayException, Inject, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { HttpOptionsBuilder } from '@/common/http/builders/http-options.builder';

type ExternalUserProfile = {
  id: number;
  name: string;
  email: string;
};

@Injectable()
export class UserService {
  constructor(
    private readonly prismaService: PrismaService,
    @Inject(HTTP_CLIENT) private readonly http: HttpClient,
  ) {}

  async createUser(createUserDto: CreateUserDto) {
    const { password: _password, ...userData } = createUserDto;

    const response = await this.prismaService.user.create({
      data: userData,
    });

    return response;
  }

  async fetchExternalProfile() {
    const options = new HttpOptionsBuilder()
      .bearerToken('2323')
      .header('Accept', 'text/html') // test: overrides default Accept
      .build();
    const url = 'https://jsonplaceholder.typicode.com/users';

    const response = await this.http.get<ExternalUserProfile>(url, options);

    if (response.status >= 400) {
      throw new BadGatewayException(
        `External profile request failed with status ${response.status}`,
      );
    }

    return response.data;
  }
}
