import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Query, Req, SetMetadata, UseGuards, UseInterceptors, UsePipes, ValidationPipe } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { query } from 'express';
import { Roles } from 'src/common/decorators/roles.decorators';
import { JwtAuthGuard } from 'src/common/guards/jwt.guards';
import { CreateUserDto } from './dtos/create.user.dto';
import { LoginUser } from './dtos/login.user.dto';
import { UpdateUserDto } from './dtos/update_user.dto';
import { UserIdDto } from './dtos/user.id.dto';
import { Role } from './enums/roles.enum';
import { LocalAuthGuard } from './guards/local.auth.guard';
import { PasswordGuard } from './guards/password.guard';
import { JwtLoginInterceptor } from './interceptors/jwt.login.interceptors';
import { UserValidationPipe } from './pipes/user.reg.validation';
import { User } from './user';
import { UserService } from './user.service';



@Controller('users')
export class UserController {
    constructor(private userService: UserService) { }

    // Registe a user
    @Post('/register')
    // @UsePipes(new ValidationPipe({whitelist: true, forbidNonWhitelisted: true}))
    async createUser(
        @Body(new UserValidationPipe()) createUserDto: CreateUserDto
    ) {
        let result = await this.userService.addUser(createUserDto)
        return result
    }

    // Gets all user
    @Get('/')
    @Roles(Role.Admin)
    @UseGuards(JwtAuthGuard)
    async getUsers(
    ) {
        return this.userService.getUsers()
    }


    @Get('/:email')
    @Roles(Role.Admin)
    @UseGuards(JwtAuthGuard)
    //  @UsePipes(new ValidationPipe({whitelist: true, forbidNonWhitelisted: true}))
    async getUser(
        @Param('email') email: string,
    ) {
        console.log("email:", email)
        return this.userService.getUser(email)
    }

    // Update a user
    @Put('/update')
    @UseGuards(JwtAuthGuard)
    async updateUser(
        @Body(new UserValidationPipe()) updateUserDto: UpdateUserDto,
    ) {
        let result = await this.userService.updateUser(updateUserDto)
        return result
    }


    // Delete a user
    @Delete('/:user_id')
    @Roles(Role.Admin)
    @UseGuards(JwtAuthGuard)
    async deleteUser(
        @Param('user_id', ParseIntPipe) user_id: number
    ) {
        console.log("user id:", user_id)
        console.log(typeof(user_id))
        return this.userService.deleteUser(user_id)
    }


    // @UseGuards(PasswordGuard)
    @UseInterceptors(JwtLoginInterceptor)
    @Post('/login')
    async login(
        @Req() req,
        @Body(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true })) loginUser: LoginUser,
    ) {
        // console.log("Headers:", req.headers)
        let response = await this.userService.login(loginUser)
        req.user = response.data['user']
        return response
    }
}
