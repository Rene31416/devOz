import { inject, injectable } from "inversify";
import { Project } from "../services/project.service";
import {
  apiController,
  body,
  Controller,
  DELETE,
  GET,
  pathParam,
  POST,
  PUT,
} from "ts-lambda-api";
import { plainToInstance } from "class-transformer";
import {LoginDto } from "../dto/login.dtos";
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
    await this.ValidateDTO(credentials, LoginDto);
    return await this.loginService.login();
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
