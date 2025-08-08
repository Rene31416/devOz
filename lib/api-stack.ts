import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import * as apigw from "aws-cdk-lib/aws-apigateway";
import * as lambda from "aws-cdk-lib/aws-lambda";
import { ApiPathBuilder } from "./constructs/api.helper";

export class apiStack extends cdk.Stack {
  private root: apigw.IResource;

  constructor(
    scope: Construct,
    id: string,
    serviceRoutingLambda: lambda.Function,
    props?: cdk.StackProps
  ) {
    super(scope, id, props);
    //Declaring api
    //const restApi = new apigw.RestApi(this, "restApi");

    //Lambda Integration
    const globalApi = new apigw.RestApi(this, "dev-opz-globalApi", {
      restApiName: "globalApi",
      deploy: false,
    });
    const resourcesBuilder = new ApiPathBuilder();
    const response = resourcesBuilder.addResources(globalApi);

    const integration = new apigw.LambdaIntegration(serviceRoutingLambda);
    const methods: apigw.Method[] = [];
    for (const path of response) {
      const method = path.resource.addMethod(path.method, integration);
      methods.push(method);
    }
    const deployment = new apigw.Deployment(this, "ManualDeployment", {
      api: globalApi,
    });
    for (const MyMethod of methods) {
      deployment.node.addDependency(MyMethod);
    }
    const publicStage = new apigw.Stage(this, "private stage", {
      stageName: "prod",
      deployment,
    });
    /*
    new apigw.Stage(this,'private stage',{
      stageName: ''
    })
    const restApi = new apigw.LambdaRestApi(this, 'dev-opz-apigw', {
      handler: serviceRoutingLambda,
      proxy: true,
      deploy: false // unable the 'prod' stage that comes by default in api gw
    });

    const deployment = new apigw.Deployment(this, "MyDeployment", {
      api: restApi,
    });

    new apigw.Stage(this, "DevStage", {
      deployment,
      stageName: "dev",
    });
*/
    //const devOz = restApi.root.addResource('devOz')
    //devOz.addMethod('ANY')
    //routing ANY (GET, POST, PUT, DELETE) method to lambda
  }
}
