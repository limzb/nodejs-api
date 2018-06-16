import express from 'express';
import bodyParser from 'body-parser';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import User from '../../models/User/User';
import { findUserByID } from '../../models/User/UserController';
import VerifyToken from './VerifyToken';
import asyncMiddleware from '../../middleware/asyncMiddleware';

const AuthRouter = express.Router();
AuthRouter.use(bodyParser.urlencoded({ extended: false }));
AuthRouter.use(bodyParser.json());

AuthRouter.post('/register', (req, res) => {
  const hashedPassword = bcrypt.hashSync(req.body.password, 8);
  User.create(
    {
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword,
    },
    (err, user) => {
      if (err) {
        console.log(err);
        const errorMessage =
          err.code === 11000 ? 'User already exist.' : 'Something is wrong!';
        if (err.code === 11000) {
          return res.status(400).send(errorMessage);
        }
        return res.status(500).send(errorMessage);
      }

      // create a token
      const token = jwt.sign({ id: user._id }, process.env.USER_SECRET, {
        expiresIn: 86400, // expires in 24 hours
      });

      return res.status(200).send({ auth: true, token });
    },
  );
});

AuthRouter.get(
  '/user',
  VerifyToken,
  asyncMiddleware(async (req, res, next) => {
    const token = req.headers['x-access-token'];
    if (!token) {
      return res
        .status(401)
        .send({ auth: false, message: 'No token provided' });
    }
    const user = await findUserByID(req.userID);
    if (!user) {
      res.status(404).send({ message: 'Failed to find user' });
    }
    res.status(200).send(user);
  }),
);

AuthRouter.post('/login', (req, res) => {
  User.findOne({ name: req.body.name }, (err, user) => {
    if (err) {
      return res.status(500).send({ error: err, message: 'No user found' });
    }
    if (!user) {
      return res.status(404).send({ message: 'No user found' });
    }
    const isPasswordValid = bcrypt.compareSync(
      req.body.password,
      user.password,
    );
    if (!isPasswordValid) {
      return res
        .status(401)
        .send({ auth: false, token: null, message: 'invalid password' });
    }
    const token = jwt.sign({ id: user._id }, process.env.USER_SECRET, {
      expiresIn: 86400,
    });
    return res.status(200).send({ auth: true, token });
  });
});

export default AuthRouter;
