import { inject, injectable } from "inversify";import {
  apiController,
  body,
  Controller,
  POST,
} from "ts-lambda-api";
import { plainToInstance } from "class-transformer";
import { LoginDto } from "../dto/login.dtos";
import { validate } from "class-validator";
import { LoginService } from "../services/login.service";
@apiController()
@injectable()
export class LoginController extends Controller {
  constructor(
    @inject(LoginService)
    private readonly loginService: LoginService
  ) {
    super();
  }

@POST("/login")
public async post(@body credentials: Record<string, string>) {
  try {
    await this.ValidateDTO(credentials, LoginDto);
    console.log('controller')
    const result = await this.loginService.login({
      user: credentials.user,
      password: credentials.password,
    });
    console.log("Login successful result:", result);
    return result;
  } catch (error) {
    console.error("LoginController /login error:", error);
    throw error;
  }
}

  public async ValidateDTO(body: Record<string, string>, bodyDTO: any) {
    try {
      const dto: Record<string, string> = plainToInstance(bodyDTO, body);
      const errors = await validate(dto);
      if (errors.length > 0) {
        throw errors;
      }
    } catch (error) {
      throw Error(`Unexpected Error validating body ${JSON.stringify(error)}`);
    }
  }
}
