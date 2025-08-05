import { StringParameter } from "aws-cdk-lib/aws-ssm";
import {
  TableV2,
  AttributeType,
  TableEncryptionV2,
} from "aws-cdk-lib/aws-dynamodb";
import { DynamoConstruct } from "../interfaces/cdkInterfaces";
import { Construct } from "constructs";
import { RemovalPolicy } from "aws-cdk-lib";
import * as kms from "aws-cdk-lib/aws-kms";
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
  public readonly keySsmTable: string;
  public readonly gsiName: string;

  constructor(scope: Construct, id: string, props: DynamoConstruct) {
    super(scope, id);
    const ssmTableName = `/table/${props.name}`;
    const keySsm = `/kms/${props.name}`;
    this.buildDynamoTable(props, ssmTableName, keySsm);
    this.ssmTableName = `${ssmTableName}-name`;
    this.ssmTableArn = `${ssmTableName}-arn`;
    this.keySsmTable = `${keySsm}-arn`;
    this.gsiName = "tableGsi";
  }

  public buildDynamoTable(
    values: DynamoConstruct,
    tableSsmName: string,
    ssmKmsName: string
  ) {
    const tableKey = new kms.Key(this, `${values.name}-kms`);

    const table = new TableV2(this, `${values.name}`, {
      partitionKey: { name: values.partitionName, type: AttributeType.STRING },
      ...(values.sortKey && {
        sortKey: { name: values.sortKey, type: AttributeType.STRING },
      }),
      removalPolicy: RemovalPolicy.DESTROY,
      encryption: TableEncryptionV2.customerManagedKey(tableKey),
    });

    new StringParameter(this, `${values.name}-ssm-name`, {
      parameterName: `${tableSsmName}-name`,
      stringValue: table.tableName,
    });

    new StringParameter(this, `${values.name}-ssm-arn`, {
      parameterName: `${tableSsmName}-arn`,
      stringValue: table.tableArn,
    });

    new StringParameter(this, `${values.name}-kms-arn`, {
      parameterName: `${ssmKmsName}-arn`,
      stringValue: tableKey.keyArn,
    });

    if (values.gsiPk) {
      table.addGlobalSecondaryIndex({
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
