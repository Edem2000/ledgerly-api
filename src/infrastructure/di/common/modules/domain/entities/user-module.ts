import { Module } from '@nestjs/common';
import { getModelToken, MongooseModule } from '@nestjs/mongoose';
import { CollectionNames, Symbols } from 'di/common';
import { BaseSchema } from 'data/mongo/schemas/base-schema';
import { EntityModel } from 'data';
import { UserModel } from 'domain/user/user';
import { UserSchema } from 'data/mongo/schemas/user-schema';
import { UserRepository } from 'domain/user/repository/repository';
import { UserRepositoryImpl } from 'data/mongo/repositories/user-repository';
import { UserService, UserServiceImpl } from 'domain/user/service/service';
import { UtilsModule } from 'di/common/modules/infrastructure/utils/utils-module';
import { Hasher } from 'domain/_utils/auth/types';

@Module({
  imports: [
    MongooseModule.forFeatureAsync([
      {
        name: CollectionNames.users,
        useFactory: (): BaseSchema<UserModel> => UserSchema.set('collection', CollectionNames.users),
      },
    ]),
    UtilsModule,
  ],
  providers: [
    {
      provide: Symbols.domain.user.userRepository,
      useFactory(model: EntityModel<UserModel>): UserRepository {
        return new UserRepositoryImpl(model);
      },
      inject: [getModelToken(CollectionNames.users)],
    },
    {
      provide: Symbols.domain.user.userService,
      useFactory(
        repository: UserRepository,
        hasher: Hasher,
      ): UserService {
        return new UserServiceImpl(repository, hasher);
      },
      inject: [
        Symbols.domain.user.userRepository,
        Symbols.infrastructure.utils.hasher,
      ],
    },
  ],
  exports: [Symbols.domain.user.userRepository, Symbols.domain.user.userService],
})

export class UserModule {}