import { Hono } from 'hono';
import { checkGhSignature } from './middleware';
import { isBountyComment } from './utils';

type Bindings = {
  GITHUB_WEBHOOK_SECRET: string;
};

const app = new Hono<{ Bindings: Bindings }>();

app.get('/', (c) => {
  console.log(c.env.GITHUB_WEBHOOK_SECRET);
  return c.text('Hello Hono!');
});

app.post('/webhook', checkGhSignature, async (c) => {
  const body = await c.req.json();
  const username = body.sender.login;
  const message = body.comment.body;

  console.log({ username, message });

  if (isBountyComment(message)) console.log('yes bounty');

  return c.json({ message: 'Webhook received' });
});

export default app;
