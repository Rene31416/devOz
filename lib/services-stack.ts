import * as cdk from "aws-cdk-lib";
import { PolicyStatement } from "aws-cdk-lib/aws-iam";
import * as lambda from "aws-cdk-lib/aws-lambda";
import { Construct } from "constructs";
import * as path from "path";
import {StringParameter} from 'aws-cdk-lib/aws-ssm'
// import * as sqs from 'aws-cdk-lib/aws-sqs';

interface serviceStackProps extends cdk.StackProps {
  tableSsmName: string;
  arnSsmName: string;
}

export class servicesStack extends cdk.Stack{
  public readonly myRoutingLambdaFunction: lambda.Function //exporting this class variable so i can pass it to api stack

  constructor(scope: Construct, id: string, props: serviceStackProps) {
    super(scope, id, props);

    const projectsTableName = StringParameter.valueForStringParameter(this, props.tableSsmName)
    const projectsTableArn = StringParameter.valueForStringParameter(this, props.arnSsmName)


    const routingLambda = new lambda.Function(this, 'routingLambda', {
      runtime: lambda.Runtime.NODEJS_18_X,
      functionName:'dev-opz-routing-lambda',
      handler: 'api.handler',
      code: lambda.Code.fromAsset(path.join(__dirname, "../dist/")),
      environment:{
        TABLE_PROJECTS_NAME: projectsTableName
      }
    })

    routingLambda.addToRolePolicy(new PolicyStatement(
      {
        actions: [
          "dynamodb:GetItem",
          "dynamodb:PutItem",
          "dynamodb:UpdateItem",
          "dynamodb:DeleteItem",
          "dynamodb:Scan"
        ],
        resources: [
          projectsTableArn
        ],
      }
    ))

    this.myRoutingLambdaFunction = routingLambda


  }
}
