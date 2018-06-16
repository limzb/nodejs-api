import User from './User';

export const findUserByID = userID =>{
  const result = User.findById(userID, { password: 0 }, (userErr, user) => {
    if (userErr) {
      return { hasError: true, error: userErr };
    }
    return { hasError: false, user };
  });
  console.log('find user by id result: ' + { ...result });
  return result;
};

