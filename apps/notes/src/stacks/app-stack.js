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
    const notesTable = new dynamodb.Table(this, 'NotesDynamoDB', {
			tableName: 'NotesTable',
			partitionKey: { name: 'id', type: dynamodb.AttributeType.STRING },
			billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
			removalPolicy: cdk.RemovalPolicy.DESTROY
		});

    const create = new lambda.NodejsFunction(this, 'NotesLambdaCreate', {
      functionName: 'NotesLambdaCreate',
      description: 'create a notes',
      entry: path.join(__dirname, '..', 'src', 'lambdas', 'create', 'index.js'),
      memorySize: 128,
      role: lambdaRoles,
      runtime: Runtime.NODEJS_14_X,
      environment: { TABLE_NAME: notesTable.tableName },
      timeout: cdk.Duration.seconds(200),
      tracing: Tracing.ACTIVE
    });

    notesTable.grantReadWriteData(create);

    /* Create Lambda Policy */
    new iam.Policy(this, 'NotesPolicy', {
      policyName: 'NotesPolicy',
      roles: [lambdaRoles],
      statements: [
        new iam.PolicyStatement({
          effect: iam.Effect.ALLOW,
          actions: ['dynamodb:*'],
          resources: [notesTable.tableArn]
        }),
        new iam.PolicyStatement({
          effect: iam.Effect.ALLOW,
          actions: ['logs:*'],
          resources: ["arn:aws:logs:*:*:*"]
        }),
      ]
    });

    const appApi = new RestApi(this, 'NotesApiGateway', {
      restApiName: 'NotesApiGateway'
    });

    const items = appApi.root.addResource('api').addResource('notes');

    const createIntegration = new LambdaIntegration(create);
    items.addMethod('POST', createIntegration);
  }
}
