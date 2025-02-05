import * as cdk from "aws-cdk-lib";
import { PolicyStatement } from "aws-cdk-lib/aws-iam";
import * as lambda from "aws-cdk-lib/aws-lambda";
import { Construct } from "constructs";
import * as path from "path";
// import * as sqs from 'aws-cdk-lib/aws-sqs';

interface serviceStackProps extends cdk.StackProps {
  tableArn: string
}

export class servicesStack extends cdk.Stack {
  public readonly myRoutingLambdaFunction: lambda.IFunction //exporting this class variable so i can pass it to api stack

  constructor(scope: Construct, id: string, props: serviceStackProps) {
    super(scope, id, props);
    console.log(`_dirname : ${__dirname}`);

    const controllerLambda = new lambda.Function(this, "controllerLambda", {
      runtime: lambda.Runtime.NODEJS_18_X,
      handler: "pibeLambda.pibeLambda", // ('name of file', 'name of function')
      code: lambda.Code.fromAsset(path.join(__dirname, "../dist/")), //directory of thesource code (ts case js files)
    });

    const myRoutingLamba = new lambda.Function(this, 'routingLambda', {
      runtime: lambda.Runtime.NODEJS_18_X,
      handler: 'api.handler',
      code: lambda.Code.fromAsset(path.join(__dirname, "../dist/")), //directory of thesource code (ts case js files)

    })

    myRoutingLamba.addToRolePolicy(new PolicyStatement(
      {
        actions: [
          "dynamodb:GetItem",
          "dynamodb:PutItem",
          "dynamodb:UpdateItem",
          "dynamodb:DeleteItem"
        ],
        resources: [
          props?.tableArn
        ],
      }
    ))
    this.myRoutingLambdaFunction = myRoutingLamba
  }
}
