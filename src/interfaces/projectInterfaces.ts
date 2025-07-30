export interface IprojecInterface {
  id: string;
  title: string;
  description: string;
}

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
  GeneralSucces ='Successfull API response'
}
export interface ItemParams{
  TableName: string;
  Key?: Record<any, any>;
  Item?: Record<any, any>;
};

export interface IApiResponse {
  statusCode: Number,
  message: String,
  data: Record<any,any>
}

export interface MyItem {
  id: string;
  name: string;
}
