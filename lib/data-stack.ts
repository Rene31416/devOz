import { Stack, StackProps } from "aws-cdk-lib";
import { AttributeType, TableV2 } from "aws-cdk-lib/aws-dynamodb"
import { Construct } from "constructs";


export class dataStack extends Stack {
    public readonly tablearn: string
    constructor(scope: Construct, id: string, props?: StackProps) {
        super(scope, id, props)

        const projectsTable = new TableV2(this, 'ProjectTable', {
            partitionKey: { name: 'projectName', type: AttributeType.STRING }
        })

        const arnTable: string = projectsTable.tableArn
        this.tablearn = arnTable

    }
}