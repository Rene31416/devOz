import { injectable } from "inversify"
import { apiController, Controller, GET } from "ts-lambda-api"

@apiController("/hello-world")
@injectable() // all controller classes must be decorated with injectable
// extending Controller is optional, it provides convenience methods
export class HelloWorldController extends Controller {
    // GET, POST, PUT, PATCH and DELETE are supported
    @GET()
    public get() {
        return {
            "hello": "world"
        }
    }

    // sub routes can be specified in method decorators
    @GET("/sub-resource")
    public getSubResource() {
        return {
            "hello": "world",
            "sub": "resource"
        }
    }
}