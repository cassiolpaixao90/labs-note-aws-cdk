export class CreateService {
  constructor({ createRepository, createDomain }){
    this.createRepository = createRepository;
    this.createDomain = createDomain;
  }

  async handle(data){
    const auction = this.createDomain.toDatabase(data);
    return await this.createRepository.create(auction);
  }
}
