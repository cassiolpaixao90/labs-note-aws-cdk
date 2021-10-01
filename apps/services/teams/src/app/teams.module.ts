import { DynamoDB } from 'aws-sdk';
import { Module } from '@nestjs/common';
import { TeamsController } from './teams.controller';
import { TeamsRepository } from './teams.repository';
import { TeamsService } from './teams.service';
import { TeamsFormMapper } from './mappers/teams-form.mapper';

@Module({
  controllers: [TeamsController],
  providers: [
    TeamsRepository,
    TeamsService,
    TeamsFormMapper,
    DynamoDB.DocumentClient,
    {
      provide: 'TEAMS_TABLE_NAME',
      useValue: process.env.TEAMS_TABLE_NAME
    }
  ],
})
export class TeamsModule {}
