import { IsEmail, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, Length, Matches } from "class-validator";
import { passwordRegex } from "src/utils/regx/validation.rule";
import { Role } from "../enums/roles.enum";

export class CreateUserDto {
    @IsString()
    @IsNotEmpty()
    firstName: string;

    @IsString()
    @IsNotEmpty()
    lastName: string;

    @IsOptional()
    @IsString()
    middleName: string;

    @IsString()
    @IsNotEmpty()
    username: string;

    @IsString()
    @IsNotEmpty()
    @Length(8, 24)
    @Matches(passwordRegex.PASSWORD_RULE, {message: passwordRegex.PASSWORD_RULE_MESSAGE})
    password: string;

    @IsString()
    @IsNotEmpty()
    @Length(8, 24)
    @Matches(passwordRegex.PASSWORD_RULE, {message: passwordRegex.PASSWORD_RULE_MESSAGE})
    confirmPassword: string;

    @IsEmail(undefined, {message: "Invalid Email"})
    @IsNotEmpty()
    email: string;

    @IsEnum(Role)
    @IsString()
    @IsNotEmpty()
    role: string

}