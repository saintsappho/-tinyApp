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
    if (users[userId].id === cookie.userId) {
      return true;
    }
  }
  return false;
};

const fetchUserUrls = (urlDatabase, userId) => {
  let userUrls = {};
  for (let shortUrl in urlDatabase) {
    // console.log('shortURL', shortUrl)
    console.log('urlDatabase', urlDatabase)
    // console.log('urlDatabase[shortUrl].longURL', urlDatabase[shortUrl].longURL)
    if (urlDatabase[shortUrl].userId == userId) {
      userUrls[shortUrl] = urlDatabase[shortUrl].longURL;
    }
  }
  console.log('userUrls', userUrls)
  return userUrls;
};

module.exports = { generateRandomString, getUserByEmail, checkLogIn, fetchUserUrls }

