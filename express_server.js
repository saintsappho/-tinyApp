/////////////////////////////////////////////////////////////////////////////////////////////
// setup / consts //
/////////////////////////////////////////////////////////////////////////////////////////////

const { randomFill } = require("crypto");
const { REFUSED } = require("dns");
const { url } = require("inspector");
const express = require("express");
const app = express();
const morgan = require('morgan');
const PORT = 8080; // default port 8080
const generateRandomString = function() {
  return Math.random().toString(36).substring(2, 7);
};
/////////////////////////////////////////////////////////////////////////////////////////////
// setup / config//
/////////////////////////////////////////////////////////////////////////////////////////////

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

/////////////////////////////////////////////////////////////////////////////////////////////
// Users //
/////////////////////////////////////////////////////////////////////////////////////////////

const users = {
  '56bn89': {
    id: "56bn89",
    email: "user@example.com",
    password: "purple-monkey-dinosaur",
  },
  po28do: {
    id: "po28do",
    email: "user2@example.com",
    password: "dishwasher-funk",
  },
};

/////////////////////////////////////////////////////////////////////////////////////////////
// database //
/////////////////////////////////////////////////////////////////////////////////////////////

const urlDatabase = {
  'b2xVn2': 'http://www.lighthouselabs.ca',
  '9sm5xK': 'http://www.google.com',
  'wlzau': 'http://www.discord.com',
  'imrro': 'http://web.compass.lighthouselabs.ca',
  'l89ty': 'http://www.youtube.com'
};


/////////////////////////////////////////////////////////////////////////////////////////////
// app.listener //
/////////////////////////////////////////////////////////////////////////////////////////////

app.listen(PORT, () => {
  console.log(`TinyApp listening on port ${PORT}!`);
});

/////////////////////////////////////////////////////////////////////////////////////////////
// Using Register cookie //
/////////////////////////////////////////////////////////////////////////////////////////////

const cookieParser = require('cookie-parser');
const { receiveMessageOnPort } = require("worker_threads");
app.use(cookieParser());

app.get("/urls", (req, res) => {
  console.log('req.cookies: ', req.cookies);
  const userId = req.cookies.user_id;
  const user = users[userId];

  const templateVars = { urls: urlDatabase, user };
  console.log('templateVar: ', templateVars);
  res.render("urls_index", templateVars);
});

app.get("/new", (req, res) => {
  const userId = req.cookies.user_id;
  const user = users[userId];

  const templateVars = {user};
  console.log('templateVar: ', templateVars);
  res.render("urls_new", templateVars);
});

app.get("/urls/:id", (req, res) => {
  const id = req.params.id
  const longURL = urlDatabase[id]
  const userId = req.cookies.user_id;
  const user = users[userId];
  
  const templateVars = {longURL, user, id};
  console.log('templateVar: ', templateVars);
  res.render("urls_show", templateVars);
});

app.get("/edit", (req, res) => {
  const userId = req.cookies.user_id;
  const user = users[userId];
  
  const templateVars = {
    urls: urlDatabase,
    user_id: req.cookies["user_id"],
    users: users
  };
  console.log('templateVar: ', templateVars);
  res.render("urls_edit", templateVars);
});

app.get("/register", (req, res) => {
  res.render("register", {user: null});
});


/////////////////////////////////////////////////////////////////////////////////////////////
// login / set cookie  //
/////////////////////////////////////////////////////////////////////////////////////////////

app.post("/login", (req, res) => {
  const user_id = req.body.user_id;
  res.cookie('user_id', user_id);
  res.cookie('users', users);
  console.log('signed in as: ', user_id);
  res.redirect("/urls");
});

/////////////////////////////////////////////////////////////////////////////////////////////
// logout / delete cookie //
/////////////////////////////////////////////////////////////////////////////////////////////

app.post("/logout", (req, res) => {
  console.log('You have signed out',);
  res.clearCookie('user_id');
  res.redirect("/");
});


/////////////////////////////////////////////////////////////////////////////////////////////
// view / edit / post //
/////////////////////////////////////////////////////////////////////////////////////////////

app.get("/urls/edit/:id", (req, res) => {
  const templateVars = {
    urls: urlDatabase,
    longURL: urlDatabase[req.params.id],
    id: req.params.id,
    user_id: req.cookies["user_id"],
    users: users
  };
  res.render('urls_edit', templateVars);
});

app.post("/urls/edit/:id", (req, res) => {
  const key = req.params.id;
  const updatedLongURL = req.body.longURL;
  urlDatabase[key] = updatedLongURL;
  res.redirect("/urls");
});

/////////////////////////////////////////////////////////////////////////////////////////////
// delete / post //
/////////////////////////////////////////////////////////////////////////////////////////////

app.post("/urls/delete/:id", (req, res) => {
  const key = req.params.id;
  delete urlDatabase[key];
  // database = (database.splice(key, 1)) -- not an array, cannot splice.
  res.redirect("/urls");
});

/////////////////////////////////////////////////////////////////////////////////////////////
// site / JSON //
/////////////////////////////////////////////////////////////////////////////////////////////

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

/////////////////////////////////////////////////////////////////////////////////////////////
// views / new //
/////////////////////////////////////////////////////////////////////////////////////////////

app.get("/urls/new", (req, res) => {
  const templateVars = {
    id: req.params.id,
    longURL: urlDatabase[req.params.id],
    user_id: req.cookies["user_id"],
    users: users
  };
  res.render("urls_new", templateVars);
});

app.post("/urls", (req, res) => {
  let random = generateRandomString();
  urlDatabase[random] = req.body['longURL'];
  res.redirect("/urls");
});

/////////////////////////////////////////////////////////////////////////////////////////////
// register //
/////////////////////////////////////////////////////////////////////////////////////////////

app.get("/register", (req, res) => {
  const templateVars = {
    users
  };
  res.render("register", templateVars);
});

app.post("/register", (req, res) => {
  const email = req.body.email;
  const password = req.body.password
  let id = generateRandomString();
  users[id] = {id, email, password };
  res.cookie('user_id', id);
  res.redirect("/urls");
});

/////////////////////////////////////////////////////////////////////////////////////////////
// Renders / Views / Show / Index/
/////////////////////////////////////////////////////////////////////////////////////////////

app.get('/show/:key', (req, res) => {
  const id = req.params;
  const templateVars = {
    url: urlDatabase[id],
    users: users
  };
  res.render('urls_show');
});

app.get("/u/:id", (req, res) => {
  const id = req.params.id;
  const longURL = urlDatabase[id];
  res.redirect(longURL);
});

app.get("/urls/:id", (req, res) => {
  const templateVars = {
    id: req.params.id,
    longURL: urlDatabase[req.params.id],
    user_id: req.cookies["user_id"],
    users: users
  };
  res.render("urls_show", templateVars);
});

app.get("/urls", (req, res) => {
  const templateVars = {
    urls: urlDatabase,
    user_id: req.cookies["user_id"],
    users: users
  };
  res.render("urls_index", templateVars);
});

app.get("/", (req, res) => {
  res.send("You've been logged out!");
});

