import {IsString,IsNotEmpty} from 'class-validator'

export class ProjectDTO {
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