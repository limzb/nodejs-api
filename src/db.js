import mongoose from 'mongoose';

const DBConnection = () => {
  mongoose.Promise = global.Promise;

  const connectionString =
    'mongodb://admin:modern-api99@ds225308.mlab.com:25308/modern-api';
  mongoose
    .connect(connectionString)
    .then(() => {
      console.log('connection to database successfull');
    })
    .catch((err) => {
      console.log(err);
    });
};

export default DBConnection;
