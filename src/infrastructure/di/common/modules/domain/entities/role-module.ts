import { Module } from '@nestjs/common';
import { Symbols } from 'di/common';
import { RoleRepository } from 'domain/role/repository/repository';
import { RoleRepositoryImpl, RolesCollection } from 'data/mongo/repositories/role-repository';
import { RoleService, RoleServiceImpl } from 'domain/role/service/service';

@Module({
  imports: [],
  providers: [
    {
      provide: Symbols.domain.role.roleRepository,
      useFactory(): RoleRepository {
        return new RoleRepositoryImpl(new RolesCollection());
      },
    },
    {
      provide: Symbols.domain.role.roleService,
      useFactory(
        repository: RoleRepository,
      ): RoleService {
        return new RoleServiceImpl(repository);
      },
      inject: [
        Symbols.domain.role.roleRepository,
      ],
    },
  ],
  exports: [Symbols.domain.role.roleRepository, Symbols.domain.role.roleService],
})

export class RoleModule {}