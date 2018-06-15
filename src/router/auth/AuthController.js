import express from 'express';
import bodyParser from 'body-parser';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import User from '../user/User';
import VerifyToken from './VerifyToken';

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
        return res.status(500).send('There was a problem registering the user');
      }

      // create a token
      const token = jwt.sign({ id: user._id }, process.env.USER_SECRET, {
        expiresIn: 86400, // expires in 24 hours
      });

      return res.status(200).send({ auth: true, token });
    },
  );
});

AuthRouter.get('/user', VerifyToken, (req, res, next) => {
  const token = req.headers['x-access-token'];
  if (!token) {
    return res.status(401).send({ auth: false, message: 'No token provided' });
  }
  User.findById(req.userID, { password: 0 }, (userErr, user) => {
    if (userErr) {
      return res
        .status(500)
        .send({
          error: userErr,
          message: 'There was a problem finding the user',
        });
    }
    res.status(200).send(user);
  });
});

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
