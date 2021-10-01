import { Injectable } from '@nestjs/common';
import { v4 as uuid } from 'uuid';
import { TeamsDomain } from "../teams.domain";
import { TeamsDtoForm } from '../teams.dto';
import { Mapper } from './mapper'

@Injectable()
export class TeamsFormMapper implements Mapper<TeamsDtoForm, TeamsDomain> {

  map(t: TeamsDtoForm): TeamsDomain {
    const id = uuid();
    return {
      id: id,
      teams_id: id,
      name: t.name,
      created_at: new Date().toISOString()
    }
  }
};
