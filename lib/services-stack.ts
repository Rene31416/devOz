import * as cdk from "aws-cdk-lib";
import { PolicyStatement } from "aws-cdk-lib/aws-iam";
import * as lambda from "aws-cdk-lib/aws-lambda";
import { Construct } from "constructs";
import * as path from "path";
import {StringParameter} from 'aws-cdk-lib/aws-ssm'
import * as kms from "aws-cdk-lib/aws-kms";
import { Secret } from "aws-cdk-lib/aws-secretsmanager";
// import * as sqs from 'aws-cdk-lib/aws-sqs';

interface serviceStackProps extends cdk.StackProps {
  tableSsmName: string;
  arnSsmName: string;
  projectKmsSsmArn: string
}

export class servicesStack extends cdk.Stack{
  public readonly myRoutingLambdaFunction: lambda.Function //exporting this class variable so i can pass it to api stack
  public readonly myAuthorizerLambda: lambda.Function //exporting this class variable so i can pass it to api stack
  public readonly myLoginLambda:lambda.Function

  constructor(scope: Construct, id: string, props: serviceStackProps) {
    super(scope, id, props);

    const projectsTableName = StringParameter.valueForStringParameter(this, props.tableSsmName)
    const projectsTableArn = StringParameter.valueForStringParameter(this, props.arnSsmName)
    const kmsProjectTableArn = StringParameter.valueForStringParameter(this, props.projectKmsSsmArn);

    const secret = new Secret(this, 'credentials')
    
    const routingLambda = new lambda.Function(this, 'routingLambda', {
      runtime: lambda.Runtime.NODEJS_20_X,
      functionName:'dev-opz-routing-lambda',
      handler: 'api.handler',
      code: lambda.Code.fromAsset(path.join(__dirname, "../dist/")),
      environment:{
        TABLE_PROJECTS_NAME: projectsTableName
      }
    })

    const loginLambda = new lambda.Function(this, 'loginLambda', {
      runtime: lambda.Runtime.NODEJS_20_X,
      functionName:'dev-opz-login-lambda',
      handler: 'login.handler',
      code: lambda.Code.fromAsset(path.join(__dirname, "../dist/")),
      environment:{
        SECRET_ARN: secret.secretArn
      }
    })
    const authorizerLambda = new lambda.Function(this, 'authorizerLambda', {
      runtime: lambda.Runtime.NODEJS_20_X,
      functionName:'dev-opz-authorizer-lambda',
      handler: 'authorizer.handler',
      code: lambda.Code.fromAsset(path.join(__dirname, "../dist/")),

    })

    routingLambda.addToRolePolicy(new PolicyStatement(
      {
        actions: [
          "dynamodb:GetItem",
          "dynamodb:PutItem",
          "dynamodb:UpdateItem",
          "dynamodb:DeleteItem",
          "dynamodb:Scan",
          "dynamodb:Query"
        ],
        resources: [
          projectsTableArn
        ],
      }
    ))
    loginLambda.addToRolePolicy(new PolicyStatement(
      {
        actions: [
          "kms:decrypt",
          "secretsmanager:GetSecretValue"
        ],
        resources: [
          secret.secretArn
        ],
      }
    ))
    
    secret.grantRead(loginLambda)
    const importedKey = kms.Key.fromKeyArn(this, 'projectKey', kmsProjectTableArn);

    importedKey.grantEncryptDecrypt(routingLambda)
    this.myRoutingLambdaFunction = routingLambda
    this.myAuthorizerLambda = authorizerLambda
    this.myLoginLambda =loginLambda


  }
}
