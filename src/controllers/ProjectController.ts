import { injectable } from "inversify";
import {
  getProject,
  createProject,
  modifyProject,
  deleteProject,
} from "../services/projectServices";
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
  // GET, POST, PUT, PATCH and DELETE are supported

  @GET("/:projectId")
  public get(@pathParam("projectId") projectId: string) {
    return getProject(projectId);
  }

  // sub routes can be specified in method decorators
  @POST("/create")
  public post(@body projectId: Record<string, string>) {
    return createProject(projectId);
  }

  @PUT("/update")
  public put(@body projectId: Record<string, string>) {
    return modifyProject(projectId);
  }

  @DELETE("/:projectId")
  public delete(@pathParam("projectId") projectId: string) {
    return deleteProject(projectId);
  }
}
