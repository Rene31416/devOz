import { StackProps } from "aws-cdk-lib";

export interface DynamoConstruct extends StackProps{
    name: String;
    partitionName: string;
    gsiPk:string;
    sortKey?: string;
}