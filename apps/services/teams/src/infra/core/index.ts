import * as cdk from '@aws-cdk/core';

import { ApplicationAPI } from './api';
import { AppDatabase } from './database';
import { AppServices } from './services';

export class ApplicationStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const database = new AppDatabase(this, 'TeamsDynamoDbServices');
    const services = new AppServices(this, 'TeamsLambdaServices', {
      teamsTable: database.teamsTable
    });

    new ApplicationAPI(this, 'API', { teamsLambdaServices: services.teamsLambdaServices });
  }
}
