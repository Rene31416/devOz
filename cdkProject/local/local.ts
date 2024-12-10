import * as path from "path";
import { AppConfig } from "ts-lambda-api";
import { ApiConsoleApp } from "ts-lambda-api-local";
import { container } from "../src/container"; // Import your container

// Create API configuration
const appConfig = new AppConfig();
appConfig.base = "/api/v1";
appConfig.version = "v1";

// Specify the path to your controllers
const controllersPath = [path.join(__dirname, "./controllers")];

// Pass the container to ApiConsoleApp
let app = new ApiConsoleApp(controllersPath, appConfig, container);

app.runServer(process.argv);
