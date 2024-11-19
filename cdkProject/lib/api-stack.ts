import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import * as apigw from "aws-cdk-lib/aws-apigateway";
import * as lambda from "aws-cdk-lib/aws-lambda";

export class apiStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: cdk.StackProps) {
    super(scope, id, props);

    const restApi = new apigw.RestApi(this, "restApi");

    //pibeApi.root.addMethod('pibe')

    const resource = restApi.root.addResource("projects");

    const lambdaArn = cdk.Fn.importValue("controllerLambdaArn");

    const LambdaIntegration = new apigw.LambdaIntegration(
      lambda.Function.fromFunctionArn(this, "integrationLambda", lambdaArn)
    );

    console.log(`ControllerLambda imported succesfully: ${lambdaArn}`);
    resource.addMethod("GET");
  }
}
