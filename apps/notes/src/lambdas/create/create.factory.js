
import { CreateHandler } from './create.handler';
import { CreateService } from './create.service';
import { CreateRepository } from './create.repository';

export const createInstance = () => {
	const createRepository = new CreateRepository();
	const createService = new CreateService({ createRepository });
	return new CreateHandler({ createService });
};