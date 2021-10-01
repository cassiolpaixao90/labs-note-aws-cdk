import { Inject, Injectable } from '@nestjs/common';
import { DynamoDB } from 'aws-sdk';

@Injectable()
export class TeamsRepository {
	constructor(
    @Inject('TEAMS_TABLE_NAME')
    private tableName: string,
    private dc: DynamoDB.DocumentClient
  ){}

  async put(payload) {
    await this.dc.put({ TableName: this.tableName, Item: payload }).promise();
  }

  async getAll(){
    const data = await this.dc.scan({ TableName: this.tableName }).promise();
    return data.Items;
  }

  // async findByKey({ device_id, water_id }){
  //   const water = await this.dc
  //   .get({
  //     TableName: this.tableName,
  //     Key: {
  //       id: device_id,
  //       water_id,
  //     },
  //   })
  //   .promise();

  //   return water.Item;
  // }

  // async findAll(){
  //   const water = await this.dc
  //     .scan({ TableName: this.tableName })
  //     .promise();

  //   return water;
  // }
}