import {IsString,IsNotEmpty} from 'class-validator'

export class PostProjectDTO {

    @IsString()
    @IsNotEmpty()
    name:string

    @IsString()
    @IsNotEmpty()
    description:string
}

export class PutProjectDTO {
    @IsString()
    @IsNotEmpty()
    id:string

    @IsString()
    @IsNotEmpty()
    name:string

    @IsString()
    @IsNotEmpty()
    description:string
}