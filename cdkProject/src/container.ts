import { Container } from "inversify";
import { HelloWorldController } from "../src/controllers/HelloWorldController";

// Create the Inversify container
const container = new Container();

// Bind your controllers
container.bind(HelloWorldController).toSelf(); // Bind controller class to itself

export { container };
