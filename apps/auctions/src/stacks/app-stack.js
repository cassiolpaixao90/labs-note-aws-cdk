import * as path from 'path';
import * as cdk from '@aws-cdk/core';
import { Tracing, Runtime } from '@aws-cdk/aws-lambda';
import * as lambda from '@aws-cdk/aws-lambda-nodejs';
import * as dynamodb from '@aws-cdk/aws-dynamodb';
import * as iam from '@aws-cdk/aws-iam';
import { LambdaIntegration, RestApi } from '@aws-cdk/aws-apigateway';

export class AppStack extends cdk.Stack {
  constructor(scope, id, props) {
    super(scope, id, props);

    /* Lambda Roles */
    const lambdaRoles = new iam.Role(this, 'AllowLambdaServiceToAssumeRole', {
      assumedBy: new iam.CompositePrincipal(
        new iam.ServicePrincipal('lambda.amazonaws.com'),
        new iam.ServicePrincipal('edgelambda.amazonaws.com'),
      ),
      managedPolicies: [iam.ManagedPolicy.fromAwsManagedPolicyName('service-role/AWSLambdaBasicExecutionRole')]
    });

    /* DynamoDb Objects */
    const auctionsTable = new dynamodb.Table(this, 'AuctionsDynamoDB', {
			tableName: 'AuctionsTable',
			partitionKey: { name: 'id', type: dynamodb.AttributeType.STRING },
			billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
			removalPolicy: cdk.RemovalPolicy.DESTROY,
		});

    const create = new lambda.NodejsFunction(this, 'AuctionsLambdaCreate', {
      functionName: 'AuctionsLambdaCreate',
      description: 'create a auctions',
      entry: path.join(__dirname, '..', 'src', 'lambdas', 'create', 'index.js'),
      memorySize: 128,
      role: lambdaRoles,
      runtime: Runtime.NODEJS_14_X,
      environment: { TABLE_NAME: auctionsTable.tableName },
      timeout: cdk.Duration.seconds(200),
      tracing: Tracing.ACTIVE
    });

    auctionsTable.grantReadWriteData(create);

    /* Create Lambda Policy */
    new iam.Policy(this, 'AuctionsPolicy', {
      policyName: 'AuctionsPolicy',
      roles: [lambdaRoles],
      statements: [
        new iam.PolicyStatement({
          effect: iam.Effect.ALLOW,
          actions: ['dynamodb:*'],
          resources: [auctionsTable.tableArn]
        }),
        new iam.PolicyStatement({
          effect: iam.Effect.ALLOW,
          actions: ['logs:*'],
          resources: ["arn:aws:logs:*:*:*"]
        }),
      ]
    });

    const appApi = new RestApi(this, 'AuctionsApiGateway', {
      restApiName: 'AuctionsApiGateway'
    });

    const items = appApi.root.addResource('api').addResource('auction');

    const createIntegration = new LambdaIntegration(create);
    items.addMethod('POST', createIntegration);
  }
}
