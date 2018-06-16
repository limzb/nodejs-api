import express from 'express';
import cors from 'cors';
import db from './db';
import AuthController from './router/auth/AuthController';

db();
const app = express();

app.use(cors());
app.use('/api/auth', AuthController);

app.use((err, req, res) => {
  // log error stack at here
  // console.error(err.stack);
  res.status(500).send('something broke');
});

app.get('/api', (req, res) => {
  res.send({
    message: 'I am a server route and can also be hot reloaded!',
  });
});

export default app;
