import jwt from 'jsonwebtoken';

const VerifyToken = (req, res, next) => {
  const token = req.headers['x-access-token'];
  if (!token) {
    return res.status(403).send({ auth: false, message: 'No token provided' });
  }
  jwt.verify(token, process.env.USER_SECRET, (error, decoded) => {
    if (error) {
      return res
        .status(500)
        .send({ auth: false, message: 'Failed to authenticate token' });
    }

    req.userID = decoded.id;
    next();
  });
};

export default VerifyToken;
