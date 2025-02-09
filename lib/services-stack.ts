import * as cdk from "aws-cdk-lib";
import { Table, TableV2 } from "aws-cdk-lib/aws-dynamodb";
import { PolicyStatement } from "aws-cdk-lib/aws-iam";
import * as lambda from "aws-cdk-lib/aws-lambda";
import { ILogGroup, LogGroup } from "aws-cdk-lib/aws-logs";
import { Construct } from "constructs";
import * as path from "path";
// import * as sqs from 'aws-cdk-lib/aws-sqs';

interface serviceStackProps extends cdk.StackProps {
  projectTable: TableV2 
}

export class servicesStack extends cdk.Stack {
  public readonly myRoutingLambdaFunction: lambda.Function //exporting this class variable so i can pass it to api stack

  constructor(scope: Construct, id: string, props: serviceStackProps) {
    super(scope, id, props);


    const routingLambda = new lambda.Function(this, 'routingLambda', {
      runtime: lambda.Runtime.NODEJS_18_X,
      functionName:'dev-opz-routing-lambda',
      handler: 'api.handler',
      code: lambda.Code.fromAsset(path.join(__dirname, "../dist/")), //directory of thesource code (ts case js files)
      environment:{
        TABLE_PROJECTS_NAME: props.projectTable.tableName
      }
    })

    routingLambda.addToRolePolicy(new PolicyStatement(
      {
        actions: [
          "dynamodb:GetItem",
          "dynamodb:PutItem",
          "dynamodb:UpdateItem",
          "dynamodb:DeleteItem"
        ],
        resources: [
          props.projectTable.tableArn
        ],
      }
    ))

    this.myRoutingLambdaFunction = routingLambda


  }
}
