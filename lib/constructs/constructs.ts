import { StringParameter } from "aws-cdk-lib/aws-ssm";
import { TableV2, AttributeType } from "aws-cdk-lib/aws-dynamodb";
import { DynamoConstruct } from "../interfaces/cdkInterfaces";
import { Construct } from "constructs";
import { Stack, RemovalPolicy } from "aws-cdk-lib";

export class dbTable extends Stack {
  constructor(scope: Construct, id: string, props: DynamoConstruct) {
    super(scope, id, props);
    this.buildDynamoTable(props);
  }

  public buildDynamoTable(values: DynamoConstruct) {
    const projectsTable = new TableV2(this, `${values.name}`, {
      partitionKey: { name: values.partitionName, type: AttributeType.STRING },
      //tableName:name, to make cicd more friendly do not set a custom name, just let cloudFormation set the table name
      removalPolicy: RemovalPolicy.DESTROY,
    });

    new StringParameter(this, `${values.name}`, {
      parameterName: `table/${projectsTable.tableName}`,
      stringValue: JSON.stringify({
        tableName: projectsTable.tableName,
        tableArn: projectsTable.tableArn,
      }),
    });
  }
}
