import {
  DeleteItemCommand,
  DynamoDBClient,
  UpdateItemCommand,
} from "@aws-sdk/client-dynamodb";
import {
  DeleteCommand,
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
  UpdateCommand,
} from "@aws-sdk/lib-dynamodb";
import { Logger } from "@aws-lambda-powertools/logger";

const logger = new Logger({
  logLevel: "DEBUG",
  serviceName: "projectService",
});

const tableName = process.env.TABLE_PROJECTS_NAME;

// get a especific project
export const getProject = async (id: string) => {
  logger.debug(`GET command to dynamo ${tableName} id: ${id}`);
  const sdk = initSdkClient();
  const itemParams = {
    TableName: tableName,
    Key: {
      id, // Key of the item to retrieve
    },
  };
  try {
    const command = new GetCommand(itemParams);
    const getValue = await sdk.send(command);
    logger.debug(`Commnad Response ${JSON.stringify(getValue.Item)}`);
    if (getValue.Item) {
      logger.debug(`Value retrieved ${JSON.stringify(getValue.Item)}`);
    } else {
      throw Error(`Project with id:${id} not found`);
    }
    return {
      code: 200,
      message: `Project with id: ${id} succesfully retrieved`,
      body: getValue.Item,
    };
  } catch (e) {
    logger.error(`${e}`);
    return {
      code: 1001,
      message: `ERROR - ${e}`,
    };
  }
};

// creates a new project
export const createProject = async (project: Record<any, any>) => {
  try {
    logger.debug(
      `POST command to dynamo ${tableName} for project ${JSON.stringify(
        project
      )}`
    );
    const { id, name, description } = validateBody(project);
    const sdk = initSdkClient();
    const params = {
      TableName: tableName,
      Item: {
        id,
        name,
        description,
      },
    };
    const command = new PutCommand(params);
    const getValue = await sdk.send(command);
    logger.debug(`Value retrieved ${getValue.Attributes}`);
    return {
      code: 200,
      message: `project with id: ${project.id} succesfully created`,
    };
  } catch (e) {
    logger.error(`${e}`);
    return {
      code: 1002,
      message: `ERROR - project id ${project.id} couldn't be retrieved: ${e}`,
    };
  }
};
//modify an existing project TODO: smae process as POST, implement UpdateCommand
export const modifyProject = async (project: Record<string, string>) => {
  try {
    logger.debug(
      `PUT command to dynamo ${tableName} for project ${JSON.stringify(
        project
      )}`
    );
    const { id, name, description } = validateBody(project);
    const sdk = initSdkClient();
    const itemParams = {
      TableName: tableName,
      Item: {
        id,
        name,
        description,
      }
    };
    const command = new PutCommand(itemParams);
    const getValue = await sdk.send(command);
    logger.debug(`Value updated succefully ${JSON.stringify(getValue)}`);
    return {
      code: 200,
      message: `Project id:${id} succefully updated`,
    };
  } catch (e) {
    logger.error(`${e}`);
    return {
      code: 1003,
      message: `Project id:${project.id} was not updated`,
    };
  }
};
//Deletes an existing project
export const deleteProject = async (id: string) => {
  const sdk = initSdkClient();
  const itemParams = {
    TableName: tableName,
    Key: {
      id,
    },
  };
  try {
    const command = new DeleteCommand(itemParams);
    await sdk.send(command);
    logger.debug(`Project id:${id} succesfuly deleted`);
    return {
      code: 200,
      message: `Project id:${id} succesfully deleted`,
    };
  } catch (e) {
    logger.error(`${e}`);
    return {
      code: 1004,
      message: `Project id:${id} was not deleted`,
    };
  }
};

const initSdkClient = (): DynamoDBClient => {
  const client = new DynamoDBClient({ region: "us-east-1" });
  const docClient = DynamoDBDocumentClient.from(client);
  return docClient;
};

const validateBody = (body: Record<any, any>) => {
  if (body.name && body.id && body.description) {
    return {
      name: body.name,
      id: body.id,
      description: body.description,
    };
  } else {
    throw Error("Not ID NAME or DESCRIPTION included in body");
  }
};
