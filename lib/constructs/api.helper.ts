import * as apigw from "aws-cdk-lib/aws-apigateway";
import * as resources from "../api/resources.json";
import { IResourceObject } from "../interfaces/cdkInterfaces";

export class ApiPathBuilder {
  constructor() {}


  public addResources(globalApi: apigw.IRestApi): IResourceObject[] {
    const response: IResourceObject[] = [];
    for (const resource of resources.private) {
      const segments = resource.path.split("/").filter(Boolean);
      let current = globalApi.root;
      for (const segment of segments) {
        current = current.getResource(segment) ?? current.addResource(segment);
      }
      response.push({
        resource: current,
        method: resource.method,
      });
    }
    return response;
  }
}
