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
import { CurrentUserCacheRepository, CurrentUserService, CurrentUserServiceImpl } from 'domain/session';
import { CurrentUserCacheRepositoryImpl } from 'data/cache/repositories/current-user-repository';
import { config } from 'infrastructure/config/config';

@Module({
    imports: [UtilsModule],
    providers: [
        {
            provide: Symbols.domain.currentUser.currentUserRepository,
            useFactory(model: EntityModel<UserModel>): CurrentUserCacheRepository {
                return new CurrentUserCacheRepositoryImpl(config.jwt.userCacheTtl);
            },
        },
        {
            provide: Symbols.domain.currentUser.currentUserService,
            useFactory(repository: CurrentUserCacheRepository): CurrentUserService {
                return new CurrentUserServiceImpl(repository);
            },
            inject: [Symbols.domain.currentUser.currentUserRepository],
        },
    ],
    exports: [Symbols.domain.currentUser.currentUserRepository, Symbols.domain.currentUser.currentUserService],
})
export class CurrentUserModule {}
