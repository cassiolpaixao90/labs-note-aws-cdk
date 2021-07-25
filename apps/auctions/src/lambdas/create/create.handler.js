import { Created } from '@labs-sample-aws-cdk/helpers';

export class CreateHandler {
    constructor({ createService }){
        this.createService = createService;
    }

    async main(event){
        const response = await this.createService.handle(event.body);
        return Created(response)
    }
}