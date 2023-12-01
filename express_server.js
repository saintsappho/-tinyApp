/////////////////////////////////////////////////////////////////////////////////////////////
// setup / consts //
/////////////////////////////////////////////////////////////////////////////////////////////

const { randomFill } = require("crypto");
const { REFUSED } = require("dns");
const { url } = require("inspector");
const express = require("express");
const app = express();
const morgan = require('morgan');
const bcrypt = require("bcryptjs");
const PORT = 8080; // default port 8080
const { generateRandomString, getUserByEmail, checkLogIn, fetchUserUrls } = require('./helpers');

/////////////////////////////////////////////////////////////////////////////////////////////
// setup / config//
/////////////////////////////////////////////////////////////////////////////////////////////

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));
var cookieSession = require('cookie-session');
app.use(cookieSession({
  name: 'session',
  keys: ['butts'],
  // Cookie Options
  maxAge: 24 * 60 * 60 * 1000 // 24 hours
}));


/////////////////////////////////////////////////////////////////////////////////////////////
// Database //
/////////////////////////////////////////////////////////////////////////////////////////////

const urlDatabase = {
  'b2xVn2': { longURL: 'http://www.lighthouselabs.ca', userId: null },
  '9sm5xK': { longURL: 'http://www.google.com', userId: null },
  'wlzau': { longURL: 'http://www.discord.com', userId: null },
  'imrro': { longURL: 'http://web.compass.lighthouselabs.ca', userId: null },
  'l89ty': { longURL: 'http://www.youtube.com', userId: null }
};

/////////////////////////////////////////////////////////////////////////////////////////////
// Database / Users //
/////////////////////////////////////////////////////////////////////////////////////////////

const users = {
  '56bn89': {
    id: "56bn89",
    email: "user@example.com",
    password: "$2a$10$jA7MrXv24A4JCjdDNboLjeLegsBfWUG.4tOWp93v5aUBWl/ESiFQ6",
  },
  po28do: {
    id: "po28do",
    email: "user2@example.com",
    password: "$2a$10$jaNkL00kc4/uFHDk1PGxCuYJrEeSl5475bzGEqrnqi45rbu/NwYoi",
  },
  buttso: {
    id: "buttso",
    email: "robinrosefleur@gmail.com",
    password: "$2a$10$BIQeTOxuzU4j9iswtJ/4X.eDBfzcccd53/EThiNEZ51NBdLH96AR.",
  }
};

/////////////////////////////////////////////////////////////////////////////////////////////
// app.listener //
/////////////////////////////////////////////////////////////////////////////////////////////

app.listen(PORT, () => {
  console.log(`TinyApp listening on port ${PORT}!`);
});

/////////////////////////////////////////////////////////////////////////////////////////////
// Cookie Sharing System //
/////////////////////////////////////////////////////////////////////////////////////////////

// const cookieParser = require('cookie-parser');
// app.use(cookieParser());
const { receiveMessageOnPort } = require("worker_threads");
const { get } = require("curl");

app.get("/urls", (req, res) => {
  if (checkLogIn(users, (req.session))) {
    const userId = req.session.userId;
    const userURLS = fetchUserUrls(urlDatabase, userId)
    const user = users[userId];
    const templateVars = { urls: userURLS, user };
    return res.render("urls_index", templateVars);
  }
  res.status(400).send("You don't have permission to see these URLS. <br><a href=/login> Please Login!</a>");
  setTimeout(res.redirect("login"), 1000)
});



app.get("/urls/:id", (req, res) => {
  if (checkLogIn(users, (req.session))) {
    const id = req.params.id;
    const longURL = urlDatabase[id].longURL;
    const userId = req.session.userId;
    const user = users[userId];
    
    const templateVars = { longURL, user, id };
    return res.render("urls_show", templateVars);
  }
  res.status(400).send("You don't have permission to see this URL.<br><a href=/login> Please Login!</a>");


  res.redirect("login");
});

/////////////////////////////////////////////////////////////////////////////////////////////
// views / new //
/////////////////////////////////////////////////////////////////////////////////////////////

app.get("/new", (req, res) => {
  if (checkLogIn(users, (req.session))) {
    const userId = req.session.userId;
    const user = users[userId];
    
    const templateVars = { user };
    return res.render("urls_new", templateVars);
  }
  res.redirect("login");
});

app.post("/urls", (req, res) => {
  let random = generateRandomString();
  if (checkLogIn(users, (req.session))) {
    urlDatabase[random] = { longURL: req.body['longURL'], userId: req.session.userId };
  }
  
  res.redirect("/urls");
});

/////////////////////////////////////////////////////////////////////////////////////////////
// login checks//
/////////////////////////////////////////////////////////////////////////////////////////////

app.get("/login", (req, res) => {
  if (checkLogIn(users, req.session)) {
    return res.redirect("urls");
  }
  res.render("login", { user: null });
});

app.post("/login", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  let id = getUserByEmail(users, email);
  if (email === '' || password === '') {
    return res.send(400, '\nPlease enter your email AND password. <br><a href=/login> Try Again!</a>');
  }
  if (!id) {
    return res.send(400, `\nNo account currently exists under that email, please Register!This is a Debugging message that is a known security risk.<br><a href=/login> Try Again!</a>`);
  }
  if (!bcrypt.compareSync(password, users[id].password)) {
    return res.send(400, `\nThat password is Incorrect. This is a Debugging message that is a known security risk.<br><a href=/login> Try Again!</a>`);
  }
  req.session.userId = id;
  res.redirect("urls");
});

/////////////////////////////////////////////////////////////////////////////////////////////
// logout / delete cookie //
/////////////////////////////////////////////////////////////////////////////////////////////

app.post("/logout", (req, res) => {
  if (!checkLogIn(users, req.session)) {
    return res.render("login", { user: null });
  }
  console.log('You have signed out');
  req.session = null;
  res.redirect("login");
});

/////////////////////////////////////////////////////////////////////////////////////////////
// view / edit / post //
/////////////////////////////////////////////////////////////////////////////////////////////

app.get("/urls/:id", (req, res) => {
  const userId = req.session.userId;
  const user = users[userId];
  if (!checkLogIn(req.session)) {
    return res.render("login", { user: null });
  }
  if (userId !== urlDatabase[req.params.id].userId) {
  }

  const templateVars = {
    urls: urlDatabase,
    userId: req.session.userId,
    users: users
  };
  res.render("urls_edit", templateVars);
  res.redirect("login");
});

app.post("/urls/edit/:id", (req, res) => {
  const id = req.params.id;
  const updatedLongURL = req.body.longURL;
  const userId = req.session.userId;
  if (userId !== urlDatabase[id].userId) {
    return res.status(400).send("You don't have permission to edit this URL<br><a href=/login> Login!</a>");
  }
  urlDatabase[id].longURL = updatedLongURL;
  res.redirect("/urls");
});

/////////////////////////////////////////////////////////////////////////////////////////////
// delete / post //
/////////////////////////////////////////////////////////////////////////////////////////////

app.post("/urls/delete/:id", (req, res) => {
  const key = req.params.id;
  if (req.session.userId === urlDatabase[key].userId) {
    delete urlDatabase[key];
  }
  res.redirect("/urls");
});

/////////////////////////////////////////////////////////////////////////////////////////////
// site / JSON //
/////////////////////////////////////////////////////////////////////////////////////////////

// app.get("/urls.json", (req, res) => {
//   res.json(urlDatabase);
// });


/////////////////////////////////////////////////////////////////////////////////////////////
// register //
/////////////////////////////////////////////////////////////////////////////////////////////

app.get("/register", (req, res) => {
  if (!checkLogIn(users, req.session)) {
    return res.render("register", { user: null });
  }
  res.redirect("urls");
});
app.post("/register", (req, res) => {
  const email = req.body.email;
  const password = bcrypt.hashSync(req.body.password, 10);
  if (email === '') {
    return res.send(400, '\nPlease enter a valid email AND password. <br><a href=/register> Try Again!</a>');
  }
  if (password === '') {
    return res.send(400, '\nPlease enter a valid email AND password. <br><a href=/register> Try Again!</a>');
  }
  if (getUserByEmail(users, email) !== false) {
    return res.send(400, '\nAn account already exists under that email. <br><a href=/register> Try Again!</a> <br><a href=/login> Login!</a>');
  }
  let id = generateRandomString();
  users[id] = { id, email, password };
  req.session.userId = id;
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
  const longURL = urlDatabase[id].longURL;
  for (indURL in urlDatabase) {
    if (id === indURL)
      return res.redirect(longURL);
  }
  return res.status(404).send('This shortened URL does not exist');
});

app.get("/", (req, res) => {
  if (!checkLogIn(users, req.session)) {
    return res.render("login", { user: null });
  }
  {
  const userId = req.session.userId;
  const userURLS = fetchUserUrls(urlDatabase, userId)
  const user = users[userId];
  const templateVars = { urls: userURLS, user };
  return res.render("urls_index", templateVars);
  }
});

module.exports = { users, urlDatabase };