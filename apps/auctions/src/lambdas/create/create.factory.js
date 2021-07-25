
import { CreateHandler } from './create.handler';
import { CreateService } from './create.service';
import { CreateRepository } from './create.repository';
import { CreateDomain } from './create.domain';

export const createInstance = () => {
	const createRepository = new CreateRepository();
	const createDomain = new CreateDomain();
	const createService = new CreateService({ createRepository, createDomain });
	return new CreateHandler({ createService });
};
