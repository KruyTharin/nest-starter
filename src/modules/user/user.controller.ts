import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ApiPaginatedResponse, ApiStandardErrorResponses } from '@/core/docs';
import { PaginationQueryDto } from '@/shared/pagination';
import { CreateUserDto } from './dto/create-user.dto';
import { UserResponseDto } from './dto/user-response.dto';
import { UserService } from './user.service';

@ApiTags('users')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @ApiPaginatedResponse(UserResponseDto)
  @ApiStandardErrorResponses(400)
  findAll(@Query() paginationQuery: PaginationQueryDto) {
    return this.userService.findAll(paginationQuery);
  }

  @Post()
  @ApiStandardErrorResponses(400)
  createUser(@Body() createUserDto: CreateUserDto) {
    return this.userService.createUser(createUserDto);
  }

  @Get('external-users')
  fetchExternalProfile() {
    return this.userService.fetchExternalProfile();
  }
}
