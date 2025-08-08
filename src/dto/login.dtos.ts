import {IsString,IsNotEmpty} from 'class-validator'

export class LoginDto {

    @IsString()
    @IsNotEmpty()
    user:string

    @IsString()
    @IsNotEmpty()
    password:string
}