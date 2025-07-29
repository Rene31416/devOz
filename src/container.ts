import { Container } from "inversify";
import { ProjectController } from "./controllers/project.controller";
import { Project } from "./services/project.service";
import { Logger } from "@aws-lambda-powertools/logger";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";


// Create the Inversify container
const container:Container = new Container();

// Bind your controllers
container.bind(ProjectController).toSelf(); // Bind controller class to itself
container.bind(Project).toSelf();
container.bind(Logger).toSelf()
container.bind(DynamoDBClient).toSelf()

export { container };
