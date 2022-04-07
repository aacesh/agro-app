import { IsNotEmpty, IsString } from "class-validator";

export class ImageDto {
    @IsNotEmpty()
    @IsString()
    id: string

    @IsNotEmpty()
    @IsString()
    name: string

}