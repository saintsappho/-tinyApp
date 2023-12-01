const { assert } = require('chai');
const {users, urlDatabase } = require('../express_server')
const { getUserByEmail } = require('../helpers.js');
const bcrypt = require("bcryptjs");

const testUsers = {
  "userRandomID": {
    id: "userRandomID", 
    email: "user@example.com", 
    password: "purple-monkey-dinosaur"
  },
  "user2RandomID": {
    id: "user2RandomID", 
    email: "user2@example.com", 
    password: "dishwasher-funk"
  }
};

describe('getUserByEmail', function() {
  it('should return a user with valid email', function() {
    const userEmail = "user@example.com"
    const expectedUserID = "userRandomID";
    assert.isTrue(expectedUserID === getUserByEmail(testUsers, userEmail))
  });
});
describe('getUserByEmail', function() {
  it('should return error if given a user with the wrong email', function() {
    const userEmail = "user2@example.com"
    const expectedUserID = "userRandomID";
    assert.isFalse(expectedUserID === getUserByEmail(testUsers, userEmail))
  });
});
describe('getUserByEmail', function() {
  it('should return true with plaintext password and hashed password', function() {
    const password = "goofyGOOBER"
    const hashedPassword = "$2a$10$0wk21oUPrrcjXeObSyIbE.hJjKCXsorqAzM6Qog0HUdfGrYmqMO.2";
    assert.isTrue(bcrypt.compareSync(password, hashedPassword))
  });
});
describe('getUserByEmail', function() {
  it('should return false with incorrect plaintext password and hashed password', function() {
    const password = "GOOBERgoofy"
    const hashedPassword = "$2a$10$0wk21oUPrrcjXeObSyIbE.hJjKCXsorqAzM6Qog0HUdfGrYmqMO.2";
    assert.isFalse(bcrypt.compareSync(password, hashedPassword))
  });
});

