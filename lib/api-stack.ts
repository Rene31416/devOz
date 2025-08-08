import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import * as apigw from "aws-cdk-lib/aws-apigateway";
import * as lambda from "aws-cdk-lib/aws-lambda";
import { ApiPathBuilder } from "./constructs/api.helper";

export class apiStack extends cdk.Stack {
  constructor(
    scope: Construct,
    id: string,
    serviceRoutingLambda: lambda.Function,
    loginLambda: lambda.Function,
    props?: cdk.StackProps
  ) {
    super(scope, id, props);

    // Create the API Gateway REST API without automatic deployment.
    // This allows full manual control over when deployments occur.
    const globalApi = new apigw.RestApi(this, "dev-opz-globalApi", {
      restApiName: "globalApi",
      deploy: false,
    });

    // Build all API Gateway resources from a predefined configuration file
    // using the ApiPathBuilder helper. Returns an array of resource/method pairs.
    const resourcesBuilder = new ApiPathBuilder();
    const response = resourcesBuilder.addResources(globalApi);

    // Create a Lambda integration that all API methods will use.
    const routingIntegration = new apigw.LambdaIntegration(
      serviceRoutingLambda
    );
    const loginIntegration = new apigw.LambdaIntegration(loginLambda);

    // Store created Method objects so we can explicitly set deployment dependencies.
    const methods: apigw.Method[] = [];
    for (const path of response) {
      if (path.authentication) {
        const privateMethod = path.resource.addMethod(
          path.method,
          routingIntegration
        );
        methods.push(privateMethod);
      } else {
        const publicMethod = path.resource.addMethod(
          path.method,
          loginIntegration
        );
        methods.push(publicMethod);
      }
    }

    // Create a Deployment to capture the current state of all resources/methods.
    // A new deployment must be created for API Gateway to serve updated endpoints.
    const deployment = new apigw.Deployment(this, "ManualDeployment", {
      api: globalApi,
    });

    // Ensure the deployment occurs only after all methods have been created.
    for (const MyMethod of methods) {
      deployment.node.addDependency(MyMethod);
    }

    // Create the "prod" stage that points to this deployment.
    // The stage represents the environment and base path for the API.
    new apigw.Stage(this, "private stage", {
      stageName: "prod",
      deployment,
    });

    // TODO: Consider moving the API resource definitions to a separate stack.
    // This would allow removing/redeploying resources without replacing the entire API stack,
    // which is useful when frequently updating endpoint definitions.
  }
}
