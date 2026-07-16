import { PrismaModule } from '@/prisma/prisma.module';
import { HttpClientModule } from '@/common/http/http.module';
import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  imports: [PrismaModule, HttpClientModule],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
