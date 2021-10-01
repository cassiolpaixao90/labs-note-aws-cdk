import { DynamoDbDataSource } from '@labs-notes-aws-cdk/datasources';

export class DeviceRepository extends DynamoDbDataSource {
  constructor(){
    super('DeviceTable')
  }
}