import { inject, injectable } from "inversify";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";

import {
  DeleteCommand,
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
} from "@aws-sdk/lib-dynamodb";
import { Logger } from "@aws-lambda-powertools/logger";
import {
  GenericError,
  IApiResponse,
  ResponseMessage,
  StatusCode,
} from "../interfaces/projectInterfaces";

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

  public async getProject(id: string): Promise<IApiResponse> {
    try {
      const itemParams = {
        TableName: this.tableName,
        Key: {
          id,
        },
      };

      const response = await this.docClient.send(new GetCommand(itemParams));
      return {
        statusCode: StatusCode.Sucess,
        message: ResponseMessage.GeneralSucces,
        data: response.Item || [],
      };
    } catch (error: any) {
      this.logger.error("Unexpected Error", { error });
      return GenericError;
    }
  }

  public async postProject(body: Record<any, any>): Promise<IApiResponse> {
    try {
      const params = {
        TableName: this.tableName,
        Item: {
          ...body,
        },
        ConditionExpression: "attribute_not_exists(id)",
      };
      await this.docClient.send(new PutCommand(params));

      return {
        statusCode: 200,
        message: ResponseMessage.GeneralSucces,
      };
    } catch (error: any) {
      if (error.name === "ConditionalCheckFailedException")
        return { statusCode: 201, message: "Item already exists" };
      this.logger.error("Unexpected Error", { error });
      return GenericError;
    }
  }

  public async putProject(body: Record<any, any>): Promise<IApiResponse> {
    try {
      const params = {
        TableName: this.tableName,
        Item: {
          ...body,
        },
      };
      this.docClient.send(new PutCommand(params));
      return {
        statusCode: 200,
        message: ResponseMessage.GeneralSucces,
      };
    } catch (error: any) {
      this.logger.error("Unexpected Error", { error });
      return GenericError;
    }
  }

  public async deleteProject(id: string): Promise<IApiResponse> {
    try {
      const params = {
        TableName: this.tableName,
        Key: {
          id,
        },
      };
      await this.docClient.send(new DeleteCommand(params));

      return {
        statusCode: 200,
        message: ResponseMessage.GeneralSucces,
      };
    } catch (error: any) {
      this.logger.error("Unexpected Error", { error });
      return GenericError;
    }
  }

}
