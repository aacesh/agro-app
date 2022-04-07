import { Logger, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import config from './utils/config';
import { User } from './api/users/user';
import { DbServiceModule } from './utils/db/db-service.module';
import { UserController } from './api/users/user.controller';
import { UserModule } from './api/users/user.module';
import { ProductModule } from './api/product/product.module';

// @Module({
//   imports: [UsersModule],
//   controllers: [AppController],
//   providers: [AppService],
// })
// export class AppModule {}

// code hidden for display purpose
@Module({
  imports: [
    DbServiceModule,
    UserModule,
    ProductModule
    // TypeOrmModule.forRoot({
    //   type:'postgres',
    //   host: config.pg.host,
    //   port: parseInt(config.pg.port),
    //   username: config.pg.user,
    //   password: config.pg.password,
    //   database: config.pg.database,
    //   entities:[User]
    // })
  ],
    controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }

