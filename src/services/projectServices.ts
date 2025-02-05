import { IprojecInterface } from '../interfaces/projectInterfaces'
import { DeleteItemCommand, DynamoDBClient, GetItemCommand, PutItemCommand, UpdateItemCommand } from '@aws-sdk/client-dynamodb'


// mock response
//basic crud
const name = "dataStack-ProjectTableE109554C-8MKI6U1FD0DB"
// gets an especific project
export const getProject = async (id: string) => {
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
        console.log(`Value retrieved ${getValue.Item}`)
    } catch (e) {
        console.error(e)
        throw new Error
    }
}

// creates a new project
export const createProject = async (id: any) => {
    console.log('printing body', id)
    const sdk: DynamoDBClient = initSdkClient()
    const params = {
        TableName: name, // Replace with your table name
        Item: {
            id: { S: "12345" },         // Primary key (string type)
            name: { S: "John Doe" },    // String attribute
            age: { N: "30" },           // Number attribute
            isActive: { BOOL: true },   // Boolean attribute
        },
    };
    try {
        const command = new PutItemCommand(params)
        const getValue = await sdk.send(command)
        console.log(`Value inserted succefully`)
    } catch (e) {
        console.error(e)
        throw new Error
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