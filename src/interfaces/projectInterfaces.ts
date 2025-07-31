/**
 * 
 * INTERFACES
 * 
 */

export interface IprojecInterface {
  id: string;
  title: string;
  description: string;
}

export interface ItemParams{
  TableName: string;
  Key?: Record<any, any>;
  Item?: Record<any, any>;
};

export interface IApiResponse {
  statusCode: Number,
  message: String,
  data?: Record<any,any>
}

export interface MyItem {
  id: string;
  name: string;
}

/**
 * ENUMS 
 */

export enum Command {
  Delete,
  Get,
  Put,
  Post
}

export enum StatusCode{
  Sucess = 200
}

export enum ResponseMessage {
  GeneralSuccess ='Successful API response'
}
/**
 * CONSTANTS
 */

export const GenericError:IApiResponse ={
  statusCode:400,
  message: 'Unexpected in Error in API',
  data: []
}
