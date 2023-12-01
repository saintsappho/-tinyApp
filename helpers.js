const { users } = require('./express_server');

const generateRandomString = function() {
  return Math.random().toString(36).substring(2, 7);
};
const getUserByEmail = function(users, email) {
  for (const user in users) {
    if (users[user].email === email) {
      return user;
    }
  } return false;
};

const checkLogIn = function(users, cookie) {
  for (let userId in users) {
    if (users[userId].id === cookie.user_id) {
      return true;
    }
  }
  return false;
};

module.exports = { generateRandomString, getUserByEmail, checkLogIn }

