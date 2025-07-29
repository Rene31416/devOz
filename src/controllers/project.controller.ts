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
import { ProjectDTO } from "../dto/projects.dtos";
import { validate } from "class-validator";
@apiController("/projects") // api/v1/hello-world for every controller define here
@injectable() // all controller classes must be decorated with injectable
// extending Controller is optional, it provides convenience methods
export class ProjectController extends Controller {
  constructor(
    @inject(Project)
    private readonly project: Project
  ) {
    super();
  }

  @GET("/:projectId")
  public get(@pathParam("projectId") projectId: string) {
    return this.project.getProject(projectId);
  }

  @GET("/test")
  public geTest() {
    return "Returning something";
  }

  @POST("/create")
  public async post(@body project: Record<string, string>) {
    //await this.ValidateDTO(project, ProjectDTO);
    return this.project.postProject(project);
  }

  @PUT("/update")
  public async put(@body project: Record<string, string>) {
    await this.ValidateDTO(project, ProjectDTO);
    return this.project.postProject(project);
  }

  @DELETE("/:projectId")
  public delete(@pathParam("projectId") projectId: string) {
    return this.project.deleteProject(projectId);
  }

  public async ValidateDTO(body: Record<string, string>, bodyDTO: any) {
    const dto: Record<string, string> = plainToInstance(bodyDTO, body);
    const error = await validate(dto);
    if (error.length) {
      throw Error(`Error in body validation ${error}`);
    }
  }
}
