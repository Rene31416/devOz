import * as cdk from 'aws-cdk-lib';
import * as lambda from 'aws-cdk-lib/aws-lambda'
import { Construct } from 'constructs';
import path = require('path');
// import * as sqs from 'aws-cdk-lib/aws-sqs';

export class servicesStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);
    console.log(`_dirname : ${__dirname}`)
    
    const pibeFunction = new lambda.Function(this, 'PibeLamba',{
      runtime: lambda.Runtime.NODEJS_18_X,
      handler:'pibeLambda.pibeLambda', // ('name of file', 'name of function')
      code:lambda.Code.fromAsset(path.join(__dirname, '../dir/lib/src/')) //directory of thesource code (ts case js files)
    }
    
    )
  }
}
