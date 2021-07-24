import middy from '@middy/core';
import JsonBodyParser from '@middy/http-json-body-parser';
import HttpEventNormalizer from '@middy/http-event-normalizer';
import { ErrorHandlerAdapter, HandlerAdapter, ValidatorAdapter } from '@labs-notes-aws-cdk/adapters';
import { makeHttpError } from '@labs-notes-aws-cdk/helpers';

import { createInstance } from './create.factory';
import { CreateSchema as schema } from './create.validator';

export const handler = middy(HandlerAdapter(createInstance()))
	.use(HttpEventNormalizer())
	.use(JsonBodyParser())
	.use(ValidatorAdapter({ schema, keys: ['body'] }))
	.use(ErrorHandlerAdapter(makeHttpError()));