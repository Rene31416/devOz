import * as apigw from "aws-cdk-lib/aws-apigateway";
import * as resources from "../api/resources.json";
import { IResourceObject } from "../interfaces/cdkInterfaces";

export class ApiPathBuilder {
  constructor() {}

  /**
   * Creates API Gateway resources based on a predefined configuration file.
   * Reuses existing resources if they already exist in the API tree.
   *
   * @param globalApi - The API Gateway instance where resources will be added.
   * @returns An array of IResourceObject containing the final resource reference and HTTP method.
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
        authentication:true
      });
    }
    return response;
  }
}
