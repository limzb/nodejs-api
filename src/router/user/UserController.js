import express from 'express';
import bodyParser from 'body-parser';
import User from './User';

const router = express.Router();
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

router.post('/', (req, res) => {
  User.create(
    {
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
    },
    (err, user) => {
      if (err) {
        return res
          .status(500)
          .send('There was a problem adding the information to the database');
      }
      return res.status(200).send(user);
    },
  );
});
