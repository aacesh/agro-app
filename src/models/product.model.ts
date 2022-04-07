import { IsInt, IsNotEmpty, IsOptional, IsPositive, IsString, Matches } from "class-validator";
import { floatRegex } from "src/utils/regx/validation.rule";



export class ProductModel {
    @IsInt()
    @IsOptional()
    id: string

    @IsString()
    @IsNotEmpty()
    name: string

    @IsString()
    @IsNotEmpty()
    description: string


    @IsNotEmpty()
    @Matches(floatRegex.float_rule, {message: floatRegex.float_rule_message})
    price: string

}