import { IsInt, IsNotEmpty, IsOptional, IsPositive, IsString, Matches } from "class-validator";
import { floatRegex } from "src/utils/regx/validation.rule";



export class CreateProductDto {
    @IsInt()
    @IsOptional()
    id: string

    @IsString()
    @IsNotEmpty()
    name: string

    @IsString()
    @IsNotEmpty()
    description: string

    @IsString()
    @IsNotEmpty()
    @Matches(floatRegex.float_rule, {message: floatRegex.float_rule_message})
    price: string


    @IsOptional()
    image: string

}