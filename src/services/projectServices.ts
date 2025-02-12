import { DeleteItemCommand, DynamoDBClient, GetItemCommand, PutItemCommand, UpdateItemCommand } from '@aws-sdk/client-dynamodb'
import { Logger } from "@aws-lambda-powertools/logger";

const logger = new Logger({
  logLevel: "INFO",
  serviceName: "projectService",
});

const name = process.env.TABLE_PROJECTS_NAME


// gets an especific project
export const getProject = async (id: string) => {
    logger.debug(`GET command to dynamo ${name} id: ${id}`)
    const sdk: DynamoDBClient = initSdkClient()
    const itemParams = {
        TableName: name,
        Key: {
            id: { S: id } // Key of the item to retrieve
        }
    }
    try {
        const command = new GetItemCommand(itemParams)
        const getValue = await sdk.send(command)
        logger.debug(`Value retrieved ${getValue.Item}`)
        return {
            code: 200,
            message:`Project with id: ${id} succesfully retrieved`,
            body: getValue.Item
        }
    } catch (e) {
        logger.error(`${e}`)
        return {
            code: 1001,
            message:`ERROR - project id ${id} couldn't be retrieved`
        }
    }
}

// creates a new project
export const createProject = async (project: any) => {
    logger.debug(`PUT command to dynamo ${name} for project ${project.id}`)
    const sdk: DynamoDBClient = initSdkClient()
    const params = {
        TableName: name, 
        Item: {
            id: { S: project.id },         
            name: { S: project.name},     
        },
    };
    try {
        const command = new PutItemCommand(params)
        const getValue = await sdk.send(command)
        logger.debug(`Value retrieved ${getValue.Attributes}`)
        return {
            code: 200,
            message:`project with id: ${project.id} succesfully created`
        }
    } catch (e) {
        logger.error(`${e}`)
        return {
            code: 1002,
            message:`ERROR - project id ${project.id} couldn't be retrieved`
        }
    }
}
//modify an existing project
export const modifyProject = async (id: string) => {
    const sdk: DynamoDBClient = initSdkClient()
    const itemParams = {
        TableName: name,
        Key: {
            id: { S: id }
        }
    }
    try {
        const command = new UpdateItemCommand(itemParams)
        const getValue = await sdk.send(command)
        console.log(`Value updated succefully`)
    } catch (e) {
        console.error(e)
        throw new Error
    }
}
//Deletes an existing project
export const deleteProject = async (id: string) => {
    const sdk: DynamoDBClient = initSdkClient()
    const itemParams = {
        TableName: name,
        Key: {
            id: { S: id } // Key of the item to retrieve
        }
    }
    try {
        const command = new DeleteItemCommand(itemParams)
        const getValue = await sdk.send(command)
        console.log(`Item succefuly`)
    } catch (e) {
        console.error(e)
        throw new Error
    }
}



const initSdkClient = (): DynamoDBClient => {
    const client = new DynamoDBClient({ region: 'us-east-1' })
    return client
}