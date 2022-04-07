import { IsInt, IsNotEmpty, IsOptional, IsString, Matches } from "class-validator";
import { floatRegex } from "src/utils/regx/validation.rule";



export class UpdateProductDto {
    @IsInt()
    @IsNotEmpty()
    id: number

    @IsString()
    @IsOptional()
    name: string

    @IsString()
    @IsOptional()
    description: string

    @IsString()
    @IsOptional()
    @Matches(floatRegex.float_rule, {message: floatRegex.float_rule_message})
    price: string

}