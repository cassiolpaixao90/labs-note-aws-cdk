import { Body, Controller, Get, Post } from '@nestjs/common';
import { TeamsDtoForm } from './teams.dto';
import { TeamsService } from './teams.service';

@Controller('teams')
export class TeamsController {
  constructor(private readonly teamsService: TeamsService) {}

  @Get()
  async findAll(){
    return this.teamsService.findAll();
  }

  @Post()
  async create(@Body() teamsDtoForm: TeamsDtoForm){
    return await this.teamsService.create(teamsDtoForm);
  }
}
