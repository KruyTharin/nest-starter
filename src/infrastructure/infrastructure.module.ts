import { Module } from '@nestjs/common';

import { DatabaseModule } from '@/infrastructure/database/database.module';
import { HttpClientModule } from '@/infrastructure/http/http.module';

@Module({
  imports: [DatabaseModule, HttpClientModule],
  exports: [DatabaseModule, HttpClientModule],
})
export class InfrastructureModule {}
