import serverlessExpress from '@vendia/serverless-express';
import app from './app.js';
import { loadCountries } from './utils/countryCache.js';
import type { APIGatewayProxyEvent, Context,Callback } from 'aws-lambda';

const bootstrap = async () => {
  await loadCountries();
  return serverlessExpress({ app });
};

let cachedHandler: ReturnType<typeof serverlessExpress> | undefined;

export const handler = (
  event: APIGatewayProxyEvent,
  context: Context,
  callback: Callback
) => {
  if (!cachedHandler) {
    bootstrap().then(handlerFn => {
      cachedHandler = handlerFn;
      return cachedHandler(event, context, callback);
    });
  } else {
    return cachedHandler(event, context, callback);
  }
};