import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user';
import { AuthModule } from '../auth/auth.module';
import { DbServiceModule } from 'src/utils/db/db-service.module';
// import { JwtService } from 'src/utils/jwt/jwt.service';

@Module({
    imports: [
        // TypeOrmModule.forFeature([User])
        DbServiceModule
    ],
    // imports: [JwtService],
    
    providers: [
        UserService,
     ],
    controllers: [UserController],
    exports: [UserService]
})
export class UserModule { }
