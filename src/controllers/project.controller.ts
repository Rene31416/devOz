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
import { validate, validateOrReject } from "class-validator";
import { error } from "console";
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
  @GET("/list")
  public getList() {
    return this.project.getAllList();
  }

  @POST("/create")
  public async post(@body project: Record<string, string>) {
    await this.ValidateDTO(project, ProjectDTO);
    return this.project.postProject(project);
  }

  @PUT("/update")
  public async put(@body project: Record<string, string>) {
    await this.ValidateDTO(project, ProjectDTO);
    return this.project.putProject(project);
  }

  @DELETE("/:projectId")
  public delete(@pathParam("projectId") projectId: string) {
    return this.project.deleteProject(projectId);
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
