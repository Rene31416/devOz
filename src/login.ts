import * as path from "path"
import { loginContainer } from "./containers/login.container"
import { AppConfig, ApiLambdaApp } from "ts-lambda-api"

const appConfig = new AppConfig()


const controllersPath = [path.join(__dirname, "controllers")]

const app = new ApiLambdaApp(controllersPath, appConfig, loginContainer)

export async function handler(event:any, context:any) {
    return await app.run(event, context)
}