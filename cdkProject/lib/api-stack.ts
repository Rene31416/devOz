import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import * as apigw from "aws-cdk-lib/aws-apigateway";
import * as lambda from "aws-cdk-lib/aws-lambda";

export class apiStack extends cdk.Stack {
  constructor(scope: Construct, id: string, serviceRoutingLambda:lambda.IFunction, props?: cdk.StackProps) {
    super(scope, id, props);
    //Declaring api
    //const restApi = new apigw.RestApi(this, "restApi");

    //Lambda Integration
    
    const restApi = new apigw.LambdaRestApi(this, 'routingLambdaItegration', {
      handler: serviceRoutingLambda,
      proxy:false
    }); 

    const devOz = restApi.root.addResource('devOz')
    devOz.addMethod('ANY')
    //routing ANY (GET, POST, PUT, DELETE) method to lambda
  }
}
