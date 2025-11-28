import { Module } from '@nestjs/common';
import { Symbols } from 'di/common';
import { HasherImpl } from 'infrastructure/utils/hash';
import { Hasher } from 'domain/_utils/auth/types';

@Module({
  providers: [
    {
      provide: Symbols.infrastructure.utils.hasher,
      useFactory(): Hasher {
        return new HasherImpl();
      },
    },
  ],
  exports: [Symbols.infrastructure.utils.hasher ],
})

export class UtilsModule {}