import { Module } from '@nestjs/common';
import { MongooseModule } from 'infrastructure/di/common/modules/infrastructure/db/mongo-module';
import { AppModule } from 'services/core/app.module';
import { UtilsModule } from 'di/common/modules/infrastructure/utils/utils-module';

@Module({
  imports: [UtilsModule, MongooseModule, AppModule],
})
export class CoreContainer {}
