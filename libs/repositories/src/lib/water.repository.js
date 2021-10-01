import { v4 as uuid } from 'uuid';
import { DynamoDbDataSource } from '@labs-notes-aws-cdk/datasources';

export class WaterRepository extends DynamoDbDataSource {
  constructor(){
    super('WaterTable')
  }

  async create({ nivel= 0, voltagem = 0, device_id = '' }){

    const water = {
      PK: device_id,
      SK: uuid(),
      nivel,
      voltagem,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    await this.put(water);
    console.log('water', water)
    return water
  }
}