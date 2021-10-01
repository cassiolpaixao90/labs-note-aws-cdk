import { Injectable } from '@nestjs/common';
import { TeamsRepository } from './teams.repository';
import { TeamsFormMapper } from './mappers/teams-form.mapper';
import { TeamsDtoForm } from './teams.dto';

@Injectable()
export class TeamsService {
  constructor(
    private readonly teamsRepository: TeamsRepository,
    private readonly teamsFormMapper: TeamsFormMapper
  ) {}

  async create(teamsDtoForm: TeamsDtoForm) {
    const teams = this.teamsFormMapper.map(teamsDtoForm)
    await this.teamsRepository.put(teams);
    return teams;
  }

  async findAll(){
    return this.teamsRepository.getAll();
  }
}
