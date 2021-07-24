
export class CreateService {
  constructor({ createRepository }){
    this.createRepository = createRepository;
  }

  async handle(data){
    return await this.createRepository.create(data);
  }
}
