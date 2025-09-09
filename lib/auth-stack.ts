import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import * as apigw from "aws-cdk-lib/aws-apigateway";
import * as cognito from "aws-cdk-lib/aws-cognito";

export class AuthStack extends cdk.Stack {
  constructor(
    scope: Construct,
    id: string,
    props?: cdk.StackProps
  ) {
    super(scope, id, props);

    const userPool = new cognito.UserPool(this, "AdminUserPool", {
      selfSignUpEnabled: false, // disable public registration
      signInAliases: { username: true },
      passwordPolicy: {
        minLength: 8,
        requireDigits: true,
        requireLowercase: true,
        requireUppercase: true,
        requireSymbols: false,
      },
    });

    const userPoolClient = new cognito.UserPoolClient(
      this,
      "AdminUserPoolClient",
      {
        userPool,
        generateSecret: false, // for public/native apps
        authFlows: {
          adminUserPassword: true, // allow admin to auth with username/password
          userPassword: true,
        },
      }
    );

    const globalApi = new apigw.RestApi(this, "dev-opz-globalApi", {
      restApiName: "globalApi",
      deploy: false,
      defaultCorsPreflightOptions: {
        allowOrigins: apigw.Cors.ALL_ORIGINS, // Or specify specific origins like ['https://example.com']
        allowMethods: apigw.Cors.ALL_METHODS, // Or specify specific methods like ['GET', 'POST']
        allowHeaders: apigw.Cors.DEFAULT_HEADERS,
        allowCredentials:true
      },
    });

    const authorizer = new apigw.CognitoUserPoolsAuthorizer(
      this,
      "CognitoAuthorizer",
      {
        cognitoUserPools: [userPool],
      }
    );


  }
}
