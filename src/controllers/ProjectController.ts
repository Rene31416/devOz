import { inject, injectable, LazyServiceIdentifier } from "inversify";
import {
  getProject,
  createProject,
  modifyProject,
  deleteProject,
} from "../services/projectServices";
import {Project} from '../services/project.service'
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
@apiController("/projects") // api/v1/hello-world for every controller define here
@injectable() // all controller classes must be decorated with injectable
// extending Controller is optional, it provides convenience methods
export class ProjectController extends Controller {
  constructor(
    @inject(new LazyServiceIdentifier( ()=>Project) )
    private readonly project : Project
  ){
    super()
  }
  // GET, POST, PUT, PATCH and DELETE are supported

  @GET("/:projectId")
  public get(@pathParam("projectId") projectId: string) {
    return this.project.getProject(projectId);
  }

  // sub routes can be specified in method decorators
  @POST("/create")
  public post(@body projectId: Record<string, string>) {
    return this.project.postProject(projectId);
  }

  @PUT("/update")
  public put(@body projectId: Record<string, string>) {
    return this.project.postProject(projectId);
  }

  @DELETE("/:projectId")
  public delete(@pathParam("projectId") projectId: string) {
    return this.project.deleteProject(projectId);
  }
}
