import { Stack, StackProps} from "aws-cdk-lib";
import { Construct } from "constructs";
import { dbTable } from "./constructs/constructs";
import { AttributeType } from "aws-cdk-lib/aws-dynamodb";

export class dataStack extends Stack {

  public readonly ssmProjectTableName: string
  public readonly ssmProjectTableArn: string

  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const projectsTable = new dbTable(this, id, {
        name:'devOpz-table',
        partitionName:'name',
        gsiPk: 'id',
      })
    this.ssmProjectTableName = projectsTable.ssmTableName
    this.ssmProjectTableArn =projectsTable.ssmTableArn
  }
}
