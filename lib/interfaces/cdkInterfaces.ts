import { StackProps } from "aws-cdk-lib";
import { IResource } from "aws-cdk-lib/aws-apigateway";

export interface DynamoConstruct extends StackProps{
    name: String;
    partitionName: string;
    sortKey?: string;
    gsiPk?:string;
}

export interface IResourceObject {
  resource:IResource;
  method: string;
}