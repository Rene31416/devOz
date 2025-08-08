import * as apigw from "aws-cdk-lib/aws-apigateway";
import * as resources from "../api/resources.json";
import { IResourceObject } from "../interfaces/cdkInterfaces";

export class ApiPathBuilder {
  constructor() {}
  /*
  private addPath(
    api: apigw.IRestApi,
    path: string,
    integrationLambda: lambda.Function
  ): cdk.aws_apigateway.Method {
    const segments = path.split("/").filter(Boolean);
    let current = this.root;

    for (const segment of segments) {
      current = current.addResource(segment);
    }
    const integration = new apigw.LambdaIntegration(integrationLambda);
    return current.addMethod("GET", integration);
  }
    */

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
