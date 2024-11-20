import * as path from "path"

import { AppConfig, ApiLambdaApp } from "ts-lambda-api"

const appConfig = new AppConfig()

appConfig.base = "/api/v1"
appConfig.version = "v1"

const controllersPath = [path.join(__dirname, "controllers")]
const app = new ApiLambdaApp(controllersPath, appConfig)

export async function handler(event:any, context:any) {
    console.log('Im working!!!!!!!!')
    return await app.run(event, context)
}