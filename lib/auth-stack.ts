import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import * as apigw from "aws-cdk-lib/aws-apigateway";
import * as lambda from "aws-cdk-lib/aws-lambda";
import { ApiPathBuilder } from "./constructs/api.helper";
import * as cognito from "aws-cdk-lib/aws-cognito";

export class AuthStack extends cdk.Stack {
  constructor(
    scope: Construct,
    id: string,
    serviceRoutingLambda: lambda.Function,
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

    // Create the API Gateway REST API without automatic deployment.
    // This allows full manual control over when deployments occur.
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

    // Build all API Gateway resources from a predefined configuration file
    // using the ApiPathBuilder helper. Returns an array of resource/method pairs.
    const resourcesBuilder = new ApiPathBuilder();
    const response = resourcesBuilder.addResources(globalApi);

    // Create a Lambda integration that all API methods will use.
    const routingIntegration = new apigw.LambdaIntegration(
      serviceRoutingLambda
    );

    // Store created Method objects so we can explicitly set deployment dependencies.
    const methods: apigw.Method[] = [];
    for (const path of response) {
      if (path.authentication) {
        const privateMethod = path.resource.addMethod(
          path.method,
          routingIntegration,
          {
            authorizer,
            authorizationType: apigw.AuthorizationType.COGNITO,
          },
        );
        methods.push(privateMethod);
      }
    }

    // Create a Deployment to capture the current state of all resources/methods.
    // A new deployment must be created for API Gateway to serve updated endpoints.

  }
}
