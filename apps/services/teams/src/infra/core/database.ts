import * as cdk from '@aws-cdk/core';
import * as dynamodb from '@aws-cdk/aws-dynamodb';

export class AppDatabase extends cdk.Construct {
  public readonly teamsTable: dynamodb.ITable;

  constructor(scope: cdk.Construct, id: string) {
    super(scope, id);

    this.teamsTable = new dynamodb.Table(this, 'Teams-DynamoDb', {
      tableName: 'TeamsTable',
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      partitionKey: {
        name: 'id',
        type: dynamodb.AttributeType.STRING,
      },
      sortKey: {
        name: 'teams_id',
        type: dynamodb.AttributeType.STRING,
      },
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });
  }
}
