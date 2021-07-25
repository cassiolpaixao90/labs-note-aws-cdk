import { v4 as uuid } from 'uuid';

export class CreateDomain {

  toDatabase({ title }){
    const now = new Date();
    return {
      id: uuid(),
      title,
      status: 'OPEN',
      createAt: now.toISOString()
    }
  }

}