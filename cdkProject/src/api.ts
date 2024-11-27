import * as path from "path"
import { container } from "../src/container"
import { AppConfig, ApiLambdaApp } from "ts-lambda-api"

const appConfig = new AppConfig()

appConfig.base = "/api/v1"
appConfig.version = "v1"

const controllersPath = [path.join(__dirname, "controllers")]

const app = new ApiLambdaApp(controllersPath, appConfig, container)

export async function handler(event:any, context:any) {
    return await app.run(event, context)
}