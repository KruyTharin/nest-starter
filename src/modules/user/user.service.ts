import { BadGatewayException, Inject, Injectable } from '@nestjs/common';

import {
  HTTP_CLIENT,
  HttpClient,
  HttpOptionsBuilder,
} from '@/infrastructure/http';
import { PrismaService } from '@/infrastructure/database';
import { buildPaginatedResult } from '@/shared/pagination';
import { CreateUserDto } from './dto/create-user.dto';
import { FindUsersQueryDto } from './dto/find-users-query.dto';
import { buildUserListQuery } from './user-list.query';

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

  async findAll(query: FindUsersQueryDto) {
    const { pagination, where, orderBy } = buildUserListQuery(query);

    const [items, total] = await Promise.all([
      this.prismaService.user.findMany({
        where,
        orderBy,
        skip: pagination.skip,
        take: pagination.take,
      }),
      this.prismaService.user.count({ where }),
    ]);

    return buildPaginatedResult(items, total, pagination.page, pagination.limit);
  }

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
      .header('Accept', 'text/html')
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
