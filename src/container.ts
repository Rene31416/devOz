import { Container } from "inversify";
import { ProjectController } from "./controllers/ProjectController";

// Create the Inversify container
const container = new Container();

// Bind your controllers
container.bind(ProjectController).toSelf(); // Bind controller class to itself

export { container };
