import { IsDefined, IsNumber } from "class-validator";

export class UserIdDto {
    @IsDefined()
    @IsNumber()
    user_id: number
}