import { BadGatewayException, Inject, Injectable } from '@nestjs/common';

import {
  HTTP_CLIENT,
  HttpClient,
  HttpOptionsBuilder,
} from '@/infrastructure/http';
import { PrismaService } from '@/infrastructure/database';
import {
  buildPaginatedResult,
  normalizePaginationQuery,
  PaginationQueryDto,
} from '@/shared/pagination';
import { CreateUserDto } from './dto/create-user.dto';

type ExternalUserProfile = {
  id: number;
  name: string;
  email: string;
};

const userListSelect = {
  id: true,
  email: true,
  name: true,
  isActive: true,
  lastLoginAt: true,
  createdAt: true,
  updatedAt: true,
} as const;

@Injectable()
export class UserService {
  constructor(
    private readonly prismaService: PrismaService,
    @Inject(HTTP_CLIENT) private readonly http: HttpClient,
  ) {}

  async findAll(paginationQuery: PaginationQueryDto) {
    const { skip, take, page, limit } = normalizePaginationQuery(
      paginationQuery.page,
      paginationQuery.limit,
    );

    const [items, total] = await Promise.all([
      this.prismaService.user.findMany({
        select: userListSelect,
        orderBy: { createdAt: 'desc' },
        skip,
        take,
      }),
      this.prismaService.user.count(),
    ]);

    return buildPaginatedResult(items, total, page, limit);
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
