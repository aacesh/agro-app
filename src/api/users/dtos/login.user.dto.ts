
import { IsDefined, IsEmail, IsNotEmpty, IsString, Length, Matches } from "class-validator";
import { passwordRegex } from "src/utils/regx/validation.rule";
import { Role } from "../enums/roles.enum";

export class LoginUser {

    @IsDefined()
    @Length(8, 24)
    @Matches(passwordRegex.PASSWORD_RULE, {message: passwordRegex.PASSWORD_RULE_MESSAGE})
    password: string;

    @IsEmail(undefined, {message: "Invalid Email"})
    @IsDefined()
    email: string;

    @IsString()
    @IsDefined()
    role: Role
}