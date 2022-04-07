import { BadRequestException, HttpException, HttpStatus, Inject, Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { PoolClient, QueryResult } from "pg";
import { Users } from 'src/data/users.json';
import { User } from './dtos/user.dto';
import { LoginUser } from './dtos/login.user.dto';
import { CreateUserDto } from './dtos/create.user.dto';
import { hashPassword, passwordMatched } from 'src/utils/hashing';
import { t_accounts } from 'src/db_helper/t_accounts';
import { DataService } from 'src/utils/db/db.service';
import { ResponseModel } from 'src/models/response.model';
import { UpdateUserDto } from './dtos/update_user.dto';



@Injectable()
export class UserService {
    private readonly users: User[] = Users.users
    constructor(@Inject('DATAMODULE') readonly dataService: DataService) {
    }

    async findOne(username: string): Promise<User> {
        const user = this.users.find(user => user.username == username)
        return user
    }

    async addUser(createUserDto: CreateUserDto) {
        try {
            console.log("createUser dto:", createUserDto)
            delete createUserDto.confirmPassword
            const hashedPassword = await hashPassword(createUserDto.password)
            createUserDto.password = hashedPassword
            let pgClient: PoolClient = this.dataService.pgClient
            const userResult = await pgClient.query(t_accounts.queries.user_by_email, [createUserDto.email])
            if (userResult.rowCount > 0) {
                console.log("user:", userResult.rows)
                throw new BadRequestException('Email already exist')
            }

            const result = await pgClient.query(
                t_accounts.functions.add_user,
                [
                    createUserDto.firstName,
                    createUserDto.lastName,
                    createUserDto.username,
                    createUserDto.password,
                    createUserDto.email,
                    createUserDto.role,
                    createUserDto.middleName
                ]
            )

            let rows = result.rows
            console.log("createUser dto:", createUserDto)
            if (result.rowCount > 0) {
                delete createUserDto.password
                let response: ResponseModel = {
                    statuscode: 201,
                    timestamp: new Date().toISOString(),
                    error: false,
                    data: createUserDto,
                    messages: "User created successfully"
                }
                return response
            } else {
                throw new Error('500::::registerUserQuery function error')
            }
        } catch (error) {
            console.log("error:", error)
            throw error
        }
    }


    async getUsers() {
        try {
            let pgClient: PoolClient = this.dataService.pgClient
            const result = await pgClient.query(t_accounts.queries.users)
            let data: object = {
                users: result.rows
            }
            let response: ResponseModel = {
                statuscode: 200,
                timestamp: new Date().toISOString(),
                error: false,
                data,
                messages: "All users"
            }
            return response
        } catch (error) {
            console.log("error:", error)
            throw error
        }

    }



    async getUser(email: string) {
        try {
            let pgClient: PoolClient = this.dataService.pgClient
            const result = await pgClient.query(t_accounts.queries.user_by_email, [email])
            let response: ResponseModel
            if (result.rowCount < 1) {
                response = {
                    data: {},
                    error: true,
                    errorType: "Not Found",
                    messages: `User not found with email ${email}`,
                    statuscode: 404,
                    timestamp: new Date().toISOString()
                }
            }
            else {
                let user = result.rows[0]
                delete user.password
                response = {
                    data: {
                        user
                    },
                    error: false,
                    messages: "User Found",
                    statuscode: 200,
                    timestamp: new Date().toISOString()
                }
            }
            return response
        } catch (error) {
            console.log("error:", error)
            throw error
        }
    }


    async updateUser(updateUserDto: UpdateUserDto) {
        try {
            console.log("updateUser dto:", updateUserDto)
            let role: string;
            if (updateUserDto.password) {
                delete updateUserDto.confirmPassword
                const hashedPassword = await hashPassword(updateUserDto.password)
                updateUserDto.password = hashedPassword
            }

            let pgClient: PoolClient = this.dataService.pgClient
            const userResult = await pgClient.query(t_accounts.queries.user_by_id, [updateUserDto.user_id])

            if (userResult.rowCount < 1) {
                throw new NotFoundException('User not found')
            }

            // console.log("user:", userResult.rows)
            role = userResult.rows[0].role
            console.log("role:", role)
            const result = await pgClient.query(
                ...t_accounts.functions.update_user(updateUserDto, role)
            )
            delete updateUserDto.password
            let response: ResponseModel = {
                statuscode: 201,
                timestamp: new Date().toISOString(),
                error: false,
                data: updateUserDto,
                messages: "User updated successfully"
            }
            return response
        } catch (error) {
            console.log("error:", error)
            throw error
        }
    }


    async deleteUser(id: number) {
        try {
            let pgClient: PoolClient = this.dataService.pgClient
            let userResult = await pgClient.query(t_accounts.queries.user_by_id, [id])
            if (userResult.rowCount < 1) {
                throw new NotFoundException('User not found')
            }
            await pgClient.query(t_accounts.queries.delete_user_by_id, [id])
            let response: ResponseModel = {
                statuscode: 200,
                timestamp: new Date().toISOString(),
                error: false,
                data: {},
                messages: "User deleted successfully"
            }
            return response
        } catch (error) {
            throw error
        }
    }

    async login(loginUser: LoginUser) {
        console.log("Login user service")
        let pgClient: PoolClient = this.dataService.pgClient
        let result: QueryResult;
        if (loginUser.role == "admin") {
            result= await pgClient.query(t_accounts.queries.admin_login, [loginUser.email, loginUser.role])
        }
        else {
            result =await pgClient.query(t_accounts.queries.user_by_email, [loginUser.email])
        }
       
        if (result.rowCount < 1) {
            throw new NotFoundException(`User not found with email ${loginUser.email}`)
        }
        let user = result.rows[0]
        user.role= loginUser.role
        let password = user.password
        if (! await passwordMatched(loginUser.password, password)) throw new UnauthorizedException(`Password not matched`)
        delete user.password
        let response: ResponseModel = {
            data: {
                user
            },
            error: false,
            messages: "User Found",
            statuscode: 200,
            timestamp: new Date().toISOString()
        }

        return response
    }
}