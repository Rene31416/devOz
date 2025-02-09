import { Stack, StackProps, RemovalPolicy } from "aws-cdk-lib";
import { AttributeType, TableV2 } from "aws-cdk-lib/aws-dynamodb";
import * as ssm from "aws-cdk-lib/aws-ssm";
import { Construct } from "constructs";
import { dbTable } from "./constructs/constructs";

export class dataStack extends Stack {
  public readonly projectTableCrossAccount: TableV2;
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    //const name = 'projectsTable-DevOpz'

    const projectsTable = new dbTable(this, 'someID', {
        name:'devOpz-table',
        partitionName:'id'
    })

  }
}
