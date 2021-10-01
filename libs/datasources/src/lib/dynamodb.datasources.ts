import { DynamoDB } from 'aws-sdk';

const dynamodb = new DynamoDB.DocumentClient();

export class DynamoDbDataSource {
  private tableName: string;

  constructor(tableName){
    this.tableName = tableName;
  }

  async put(payload) {
    return await dynamodb.put({ TableName: this.tableName, Item: payload }).promise();
  }

  async getAll(){
    const data = await dynamodb.scan({ TableName: this.tableName }).promise();
    return data.Items;
  }

  async getById(id){
    return await dynamodb.query({
      TableName: this.tableName,
      KeyConditionExpression: 'PK = :pk',
      ExpressionAttributeValues: {
        ':pk': id
      }
    }).promise();
  }

}