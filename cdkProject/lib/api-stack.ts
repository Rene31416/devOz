import * as cdk from 'aws-cdk-lib'
import { Construct } from 'constructs';
import * as apigw from 'aws-cdk-lib/aws-apigateway'


export class apiStack extends cdk.Stack{

    constructor(scope:Construct, id: string, props: cdk.StackProps){
        super(scope, id, props)

        const pibeApi = new apigw.RestApi(this,'pibeApi')

        //pibeApi.root.addMethod('pibe')

        const resource = pibeApi.root.addResource('pibe')
        resource.addMethod('GET')


    }
}