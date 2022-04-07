import { IsDefined, IsEmail, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, Length, Matches } from "class-validator";
import { passwordRegex } from "src/utils/regx/validation.rule";
import { Role } from "../enums/roles.enum";

export class UpdateUserDto {

    @IsDefined()
    @IsNumber()
    user_id: number
    
    @IsOptional()
    @IsString()
    firstName: string;

    @IsOptional()
    @IsString()
    middleName: string;

    @IsOptional()
    @IsString()
    lastName: string;

    @IsOptional()
    @IsString()
    username: string;

    @IsOptional()
    @IsString()
    @Length(8, 24)
    @Matches(passwordRegex.PASSWORD_RULE, {message: passwordRegex.PASSWORD_RULE_MESSAGE})
    password: string;


    @IsOptional()
    @IsString()
    @Length(8, 24)
    @Matches(passwordRegex.PASSWORD_RULE, {message: passwordRegex.PASSWORD_RULE_MESSAGE})
    confirmPassword: string;


    @IsOptional()
    @IsEmail(undefined, {message: "Invalid Email"})
    email: string;

    @IsOptional()
    @IsEnum(Role)
    @IsString()
    role: string

}