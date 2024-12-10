import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import * as apigw from "aws-cdk-lib/aws-apigateway";
import * as lambda from "aws-cdk-lib/aws-lambda";
import { api } from "ts-lambda-api";

export class apiStack extends cdk.Stack {
  constructor(scope: Construct, id: string, serviceRoutingLambda: lambda.IFunction, props?: cdk.StackProps) {
    super(scope, id, props);
    //Declaring api
    //const restApi = new apigw.RestApi(this, "restApi");

    //Lambda Integration

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

    //const devOz = restApi.root.addResource('devOz')
    //devOz.addMethod('ANY')
    //routing ANY (GET, POST, PUT, DELETE) method to lambda
  }
}
