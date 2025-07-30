import { inject, injectable, LazyServiceIdentifier } from "inversify";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";

import {
  DeleteCommand,
  DynamoDBDocumentClient,
  GetCommand,
  GetCommandOutput,
  PutCommand,
} from "@aws-sdk/lib-dynamodb";
import { Logger } from "@aws-lambda-powertools/logger";
import { Command, IApiResponse, ItemParams, MyItem, ResponseMessage, StatusCode } from "../interfaces/projectInterfaces";
import { Result } from "aws-cdk-lib/aws-stepfunctions";

@injectable()
export class Project {
  private readonly tableName = process.env.TABLE_PROJECTS_NAME || "";
  private readonly client = new DynamoDBClient({ region: "ca-central-1" });
  private docClient: DynamoDBDocumentClient;

  constructor(
    @inject(Logger)
    private logger: Logger
  ) {
    this.docClient = DynamoDBDocumentClient.from(this.client);
  }

  public async getProject(id: string) : Promise<IApiResponse>{
    try{
    const itemParams: ItemParams = {
      TableName: this.tableName,
      Key: {
        id,
      },
    };
    const response: GetCommandOutput = await this.dynamoDb(Command.Get, itemParams);

    return {
      statusCode: StatusCode.Sucess,
      message: ResponseMessage.GeneralSucces,
      data: response.Item 
    }
    } catch (error){

    }
    
  }
  public async postProject(body: Record<any, any>) {
    const params: ItemParams = {
      TableName: this.tableName,
      Item: {
        ...body,
      },
    };
    const response = await this.dynamoDb(Command.Post, params);
    return {
      statusCode: 200
    }
  }

  public async putProject(body: Record<any, any>) {
    const params: ItemParams = {
      TableName: this.tableName,
      Item: {
        ...body,
      },
    };
    const response = await  this.dynamoDb(Command.Put, params);
  }

  public async deleteProject(id: string) {
    const params: ItemParams = {
      TableName: this.tableName,
      Key: {
        id,
      },
    };
    const response = await  this.dynamoDb(Command.Delete, params);
  }

  private async dynamoDb(operation: Command, itemParams: ItemParams) {
    try {
      switch (operation) {
        case Command.Get:
          return await this.docClient.send(
            new GetCommand({
              TableName: this.tableName,
              Key: itemParams.Key,
            })
          );
        case Command.Post:
          return await this.docClient.send(
            new PutCommand({
              TableName: this.tableName,
              Item: itemParams.Item,
              ConditionExpression: "attribute_not_exists(id)",
            })
          );

        case Command.Put:
          return await this.docClient.send(
            new PutCommand({
              TableName: this.tableName,
              Item: itemParams.Item,
            })
          );
        case Command.Delete:
          return await this.docClient.send(
            new DeleteCommand({
              TableName: this.tableName,
              Key: itemParams.Key,
            })
          );
      }
    } catch (error: any) {
      if (error.name === "ConditionalCheckFailedException")
        return { statuCode: 201, Mesage: "Item already exists" };
      this.logger.error(`Unexpected Error in dynamoDb operation`);
      this.logger.error(JSON.stringify({ error }));
      throw error;
    }
  }
}
