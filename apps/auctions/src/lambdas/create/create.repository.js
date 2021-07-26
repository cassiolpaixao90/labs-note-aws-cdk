import { DynamoDbDataSource } from '@labs-notes-aws-cdk/datasources';

export class CreateRepository extends DynamoDbDataSource {
  constructor(){
    super('AuctionsTable')
  }
}