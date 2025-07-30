import { inject, injectable, LazyServiceIdentifier } from "inversify";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";

import {
  DeleteCommand,
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
} from "@aws-sdk/lib-dynamodb";
import { Logger } from "@aws-lambda-powertools/logger";
import { Command, ItemParams } from "../interfaces/projectInterfaces";

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

  public async getProject(id: string) {
    const itemParams: ItemParams = {
      TableName: this.tableName,
      Key: {
        id,
      },
    };
    return this.dynamoDb(Command.Get, itemParams);
  }
  public async postProject(body: Record<any, any>) {
    const params: ItemParams = {
      TableName: this.tableName,
      Item: {
        ...body,
      },
    };
    return this.dynamoDb(Command.Post, params);
  }

  public async putProject(body: Record<any, any>) {
    const params: ItemParams = {
      TableName: this.tableName,
      Item: {
        ...body,
      },
    };
    return this.dynamoDb(Command.Put, params);
  }

  public async deleteProject(id: string) {
    const params: ItemParams = {
      TableName: this.tableName,
      Key: {
        id,
      },
    };
    return this.dynamoDb(Command.Delete, params);
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
