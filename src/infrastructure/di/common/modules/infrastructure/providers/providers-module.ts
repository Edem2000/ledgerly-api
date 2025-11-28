import { Module } from '@nestjs/common';
import { Symbols } from 'di/common';
import { UserUsecasesModule } from 'di/common/modules/domain/usecases/user-usecases-module';
import { CurrentUserProvider } from 'infrastructure/utils/current-user-provider';

@Module({
  imports: [
    UserUsecasesModule
  ],
  providers: [
    {
      provide: Symbols.infrastructure.providers.currentUser,
      useClass: CurrentUserProvider,
    },
  ],
  exports: [Symbols.infrastructure.providers.currentUser],
})

export class ProvidersModule {}