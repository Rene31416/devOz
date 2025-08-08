#!/usr/bin/env node
import "source-map-support/register";
import * as cdk from "aws-cdk-lib";
import { servicesStack } from "../lib/services-stack";
import { apiStack } from "../lib/api-stack";
import { dataStack } from "../lib/data-stack";

const app = new cdk.App();

const deployDataStack = new dataStack(app, "dataStack", {
  env: { region: "ca-central-1" },
});

const deployServiceStack = new servicesStack(app, "serviceStack", {
  tableSsmName: deployDataStack.ssmProjectTableName,
  arnSsmName: deployDataStack.ssmProjectTableArn,
  projectKmsSsmArn: deployDataStack.ssmKProjectsTableKmsArn,
});

new apiStack(
  app,
  "apiStack",
  deployServiceStack.myAuthorizerLambda,
  deployServiceStack.myLoginLambda
);
