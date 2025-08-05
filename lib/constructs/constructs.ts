import { StringParameter } from "aws-cdk-lib/aws-ssm";
import { TableV2, AttributeType } from "aws-cdk-lib/aws-dynamodb";
import { DynamoConstruct } from "../interfaces/cdkInterfaces";
import { Construct } from "constructs";
import { RemovalPolicy } from "aws-cdk-lib";
/**
 * Creates a new DynamoDB table and stores its name and ARN in AWS Systems Manager (SSM) Parameter Store.
 *
 * @param scope - The parent construct in which this construct is created.
 * @param id - The unique identifier for this construct.
 * @param props - The properties required to configure the DynamoDB table, including:
 *   - `name`: The name of the table.
 *   - `partitionName`: The name of the partition key.
 *
 * This constructor initializes the table and stores its metadata in SSM parameters:
 * - The table name is stored under `/table/{name}-name`.
 * - The table ARN is stored under `/table/{name}-arn`.
 */

export class dbTable extends Construct {
  public readonly ssmTableName: string;
  public readonly ssmTableArn: string;
  public readonly gsiName: string;

  constructor(scope: Construct, id: string, props: DynamoConstruct) {
    super(scope, id);
    const ssmParamName = `/table/${props.name}`;
    this.buildDynamoTable(props, ssmParamName);
    this.ssmTableName = `${ssmParamName}-name`;
    this.ssmTableArn = `${ssmParamName}-arn`;
    this.gsiName = "tableGsi";
  }

  public buildDynamoTable(values: DynamoConstruct, ssmName: string) {
    const projectsTable = new TableV2(this, `${values.name}`, {
      partitionKey: { name: values.partitionName, type: AttributeType.STRING },
      removalPolicy: RemovalPolicy.DESTROY,
    });

    new StringParameter(this, `${values.name}-ssm-name`, {
      parameterName: `${ssmName}-name`,
      stringValue: projectsTable.tableName,
    });

    new StringParameter(this, `${values.name}-ssm-arn`, {
      parameterName: `${ssmName}-arn`,
      stringValue: projectsTable.tableArn,
    });
    if (values.gsiPk) {
      projectsTable.addGlobalSecondaryIndex({
        indexName: "tableGsi",
        partitionKey: {
          name: values.gsiPk,
          type: AttributeType.STRING,
        },
      });
    }
  }
  /**
   *
   * TODO: implement GSI method
   *
   * @param name
   * @param pk
   * @param pkType
   * @param table
   * @param sk
   * @param skType
   */
  public buildGsi(
    name: string,
    pk: string,
    pkType: AttributeType,
    table: TableV2,
    sk?: string,
    skType?: AttributeType
  ) {
    if (sk != undefined && skType != undefined) {
      table.addGlobalSecondaryIndex({
        indexName: name,
        partitionKey: {
          name: pk,
          type: pkType,
        },
        sortKey: {
          name: sk,
          type: skType,
        },
      });
    }
    if (sk && skType)
      table.addGlobalSecondaryIndex({
        indexName: name,
        partitionKey: {
          name: pk,
          type: pkType,
        },
        sortKey: {
          name: sk,
          type: skType,
        },
      });
  }
}
