import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import * as apigw from "aws-cdk-lib/aws-apigateway";
import * as lambda from "aws-cdk-lib/aws-lambda";

export class apiStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: cdk.StackProps) {
    super(scope, id, props);

    const restApi = new apigw.RestApi(this, "restApi");

    //pibeApi.root.addMethod('pibe')

    const resource = restApi.root.addResource("devOpz");

    const routingLambdaArn = cdk.Fn.importValue("routingLambdaArn");

    const LambdaIntegration = new apigw.LambdaIntegration(
      lambda.Function.fromFunctionArn(this, "integrationLambda", routingLambdaArn)
    );

  }
}
