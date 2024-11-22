#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import {servicesStack} from '../lib/services-stack'
import {apiStack} from '../lib/api-stack'

const app = new cdk.App();
const deployServiceStack = new servicesStack(app, 'servicesStack');

new apiStack(app, 'pibeApiStack',deployServiceStack.myRoutingLambdaFunction )