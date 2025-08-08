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

    // Loop through all resource definitions in the configuration file.
    for (const resource of resources.private) {
      // Split the path into segments (e.g., "api/v1/projects" → ["api", "v1", "projects"])
      const segments = resource.path.split("/").filter(Boolean);

      // Start from the API root and create/reuse nested resources for each segment.
      let current = globalApi.root;
      for (const segment of segments) {
        current = current.getResource(segment) ?? current.addResource(segment);
      }

      // Store the final resource and its HTTP method in the response array.
      response.push({
        resource: current,
        method: resource.method,
        authentication:true
      });
    }
    for (const resource of resources.public) {
      // Split the path into segments (e.g., "api/v1/projects" → ["api", "v1", "projects"])
      const segments = resource.path.split("/").filter(Boolean);

      // Start from the API root and create/reuse nested resources for each segment.
      let current = globalApi.root;
      for (const segment of segments) {
        current = current.getResource(segment) ?? current.addResource(segment);
      }

      // Store the final resource and its HTTP method in the response array.
      response.push({
        resource: current,
        method: resource.method,
        authentication:false
      });
    }
    return response;
  }
}
