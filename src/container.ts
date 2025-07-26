import { Container } from "inversify";
import { ProjectController } from "./controllers/project.controller";
import { Project } from "./services/project.service";

// Create the Inversify container
const container = new Container();

// Bind your controllers
container.bind(ProjectController).toSelf(); // Bind controller class to itself
container.bind(Project).toSelf();

export { container };
