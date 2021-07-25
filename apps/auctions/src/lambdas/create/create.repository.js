import { DynamoDB } from 'aws-sdk';

export class CreateRepository {
  constructor(){
    this.dynamodb = new DynamoDB.DocumentClient();
  }

  async create(auction){
    await this.dynamodb.put({
      TableName: 'AuctionsTable',
      Item: auction
    }).promise();

    return auction;
  }
}