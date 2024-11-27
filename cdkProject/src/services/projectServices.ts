import { mock } from 'node:test'
import {IprojecInterface} from '../interfaces/projectInterfaces'


// mock response

const mockReponse:IprojecInterface ={
    id:'123',
    title:'dummyProject',
    description:'SomeDummyDescription'

}

export const getProject=():IprojecInterface=>{
    return mockReponse
}
export const postProject=():IprojecInterface=>{
    return mockReponse
}
export const putProject=(id:string):IprojecInterface=>{
    mockReponse.id = id
    return mockReponse
}