import {
  inject,
  injectable,
  LazyServiceIdentifier,
} from "inversify/lib/cjs";
import {
  DynamoDBClient,
} from "@aws-sdk/client-dynamodb";

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
  private readonly dynamoClient = new DynamoDBClient({ region: "us-east-1" });
  private docClient: DynamoDBDocumentClient;

  constructor(
    client: DynamoDBClient,
    @inject(new LazyServiceIdentifier(() => Logger))
    private logger: Logger
  ) {
    this.dynamoClient = client;
    this.docClient = DynamoDBDocumentClient.from(client);
  } 

  public async getProject(id: string) {
    this.logger.debug(`GET command to dynamo ${this.tableName} id: ${id}`);
    const itemParams: ItemParams = {
      TableName: this.tableName,
      Key: {
        id,
      },
    };
    return this.dynamoDb(Command.Get, itemParams);
  }
  public async postProject(body: Record<any, any>) {
    const params = {
      TableName: this.tableName,
      Item: {
        body,
      },
    };
    this.dynamoDb(Command.Put, params);
  }

  public async deleteProject(id: string){
    const params = {
        TableName: this.tableName,
        key: {
            id
        }
    }
    return this.dynamoDb(Command.Delete, params)
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
    } catch (error) {
      this.logger.error(`Unexpected Error in dynamoDb operation`);
      this.logger.error(JSON.stringify({ error }));
      throw error;
    }
  }
}
