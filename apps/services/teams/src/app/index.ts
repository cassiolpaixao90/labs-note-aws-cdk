import { NestFactory } from '@nestjs/core';
import thundraWarmup from '@thundra/warmup';
import serverlessExpress from '@vendia/serverless-express';
import { Callback, Context, Handler } from 'aws-lambda';
import { TeamsModule } from './teams.module';

let server: Handler;
const warmup = thundraWarmup();

async function bootstrap(): Promise<Handler> {
  const app = await NestFactory.create(TeamsModule);
  await app.init();
  const expressApp = app.getHttpAdapter().getInstance();
  return serverlessExpress({ app: expressApp });
}

export const handler: Handler = warmup(async (event, context: Context, callback: Callback) => {
  server = server ?? (await bootstrap());
  return server(event, context, callback);
});
