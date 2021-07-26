import { DynamoDB } from 'aws-sdk';

const dynamodb = new DynamoDB.DocumentClient();

export class DynamoDbDataSource {

  constructor(tableName){
    this.tableName = tableName;
  }

  async create(payload) {
    return dynamodb.put({ TableName: this.tableName, Item: payload }).promise();
  }

}