import * as path from 'path';
import * as cdk from '@aws-cdk/core';
import * as dynamodb from '@aws-cdk/aws-dynamodb';
import * as lambda from '@aws-cdk/aws-lambda';
import * as iam from '@aws-cdk/aws-iam';

interface AppServicesProps {
  teamsTable: dynamodb.ITable;
}

export class AppServices extends cdk.Construct {
  public readonly teamsLambdaServices: lambda.Function;

  constructor(scope: cdk.Construct, id: string, props: AppServicesProps) {
    super(scope, id);

    this.teamsLambdaServices = new lambda.Function(this, 'Teams-LambdaServices', {
      functionName: 'Teams-LambdaService',
      description: 'Teams lambda service',
      code: lambda.Code.fromAsset(path.join(__dirname, '..', '..', '..', 'dist')),
      handler: 'index.handler',
      memorySize: 256,
      runtime: lambda.Runtime.NODEJS_14_X,
      timeout: cdk.Duration.seconds(120),
      tracing: lambda.Tracing.ACTIVE
    });

    props.teamsTable.grantReadWriteData(this.teamsLambdaServices);

    this.teamsLambdaServices.addToRolePolicy(
      new iam.PolicyStatement({
        resources: ['*'],
        actions: [
          'dynamodb:*'
        ]
      }),
    );

    this.teamsLambdaServices.addEnvironment('TEAMS_TABLE_NAME', props.teamsTable.tableName);
  }
}
