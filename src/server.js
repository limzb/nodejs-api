import express from 'express';
import db from './db';
import AuthController from './router/auth/AuthController';

db();
const app = express();

app.use('/api/auth', AuthController);

app.get('/api', (req, res) => {
  res.send({
    message: 'I am a server route and can also be hot reloaded!',
  });
});

export default app;
