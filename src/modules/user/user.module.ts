import { Module } from '@nestjs/common';

import { HttpClientModule } from '@/infrastructure/http';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  imports: [HttpClientModule],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
