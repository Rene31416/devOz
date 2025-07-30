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

export interface ItemParams{
  TableName: string;
  Key?: Record<any, any>;
  Item?: Record<any, any>;
};
