import { HttpStatus, Inject, Injectable } from '@nestjs/common';

import { AppException, ErrorCode } from '@/core';
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

    try {
      
      const response = await this.prismaService.user.create({
        data: userData,
      });

      return response;
    } catch (error) {
      throw new AppException(HttpStatus.CONFLICT, {
        message: 'Email already exists',
        error: 'Conflict',
        errorCode: ErrorCode.DB_ERROR,
      }, {
        cause: error,
      });
    }
  }

  async fetchExternalProfile() {
    const options = new HttpOptionsBuilder()
      .bearerToken('2323')
      .header('Accept', 'application/json')
      .build();

    const response = await this.http.get<ExternalUserProfile>(
      'https://jsonplaceholder.typicode.com/users/1',
      options,
    );

    return response.data;
  }
}
