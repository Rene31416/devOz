import { Container } from "inversify";
import { LoginController } from "../controllers/login.controller";
import { LoginService } from "../services/login.service"
import { Logger } from "@aws-lambda-powertools/logger";


// Create the Inversify container
const loginContainer:Container = new Container();

// Bind your controllers
loginContainer.bind(LoginController).toSelf(); // Bind controller class to itself
loginContainer.bind(LoginService).toSelf();
loginContainer.bind(Logger).toSelf()

export { loginContainer };
