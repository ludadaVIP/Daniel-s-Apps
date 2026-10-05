import express, { type Express } from 'express';

export const app: Express = express();

app.disable('x-powered-by');
app.get('/health', (_request, response) => {
  response.json({ status: 'ok', subject: 'chemistry' });
});
