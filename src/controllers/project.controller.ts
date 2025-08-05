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
  public async get(@pathParam("projectId") projectId: string) {
    return await this.project.getProject(projectId);
  }
  @GET("/list")
  public async getList() {
    return await this.project.getAllList();
  }

  @POST("/create")
  public async post(@body project: Record<string, string>) {
    await this.ValidateDTO(project, ProjectDTO);
    return await this.project.postProject(project);
  }

  @PUT("/update")
  public async put(@body project: Record<string, string>) {
    await this.ValidateDTO(project, ProjectDTO);
    return await this.project.putProject(project);
  }

  @DELETE("/:projectId")
  public async delete(@pathParam("projectId") projectId: string) {
    return await this.project.deleteProject(projectId);
  }

  public async ValidateDTO(body: Record<string, string>, bodyDTO: any) {
    try {
      const dto: Record<string, string> = plainToInstance(bodyDTO, body);
      const errors = await validate(dto);
      if(errors.length>0){
        throw errors
      }
    } catch (error) {
      throw Error(`Unexpected Error validating body ${JSON.stringify(error)}`);
    }
  }
}
