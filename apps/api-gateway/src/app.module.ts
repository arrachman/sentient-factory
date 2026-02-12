import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { MenusModule } from './menus/menus.module';
import { MasterDataContactsModule } from './master-data-contacts/master-data-contacts.module';
import { MasterDataUomsModule } from './master-data-uoms/master-data-uoms.module';
import { MasterDataItemsModule } from './master-data-items/master-data-items.module';
import { MasterDataProvincesModule } from './master-data-provinces/master-data-provinces.module';
import { MasterDataCitiesModule } from './master-data-cities/master-data-cities.module';
import { MasterDataWarehousesModule } from './master-data-warehouses/master-data-warehouses.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    PrismaModule,
    AuthModule,
    UsersModule,
    MenusModule,
    MasterDataContactsModule,
    MasterDataUomsModule,
    MasterDataItemsModule,
    MasterDataProvincesModule,
    MasterDataCitiesModule,
    MasterDataWarehousesModule,
  ],
})
export class AppModule {}
