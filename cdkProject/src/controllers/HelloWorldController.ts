import { injectable } from "inversify"
import { getProject, postProject, putProject } from "../services/projectServices"
import { apiController, Controller, GET, pathParam, POST, PUT, queryParam } from "ts-lambda-api"
@apiController("/projects") // api/v1/hello-world for every controller define here

@injectable() // all controller classes must be decorated with injectable
// extending Controller is optional, it provides convenience methods
export class HelloWorldController extends Controller {
    // GET, POST, PUT, PATCH and DELETE are supported
    
    @GET("/")
    public get() {
        return getProject()
    }

    // sub routes can be specified in method decorators
    @POST("/")
    public post() {
        return postProject()
    }

    @PUT("/:id")
    public put( @queryParam('id') id:string) {
        return putProject(id)
    }
        

}

