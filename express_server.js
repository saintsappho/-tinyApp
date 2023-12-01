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
const getUserByEmail = function(email) {
  for (const user in users) {
    if (users[user].email === email) {
      return user;
    }
  } return false;
};

const checkLogIn = function(cookies) {
  for (let user in users) {
    if (user === cookies.user_id) {
      return true;
    };
  }
  return false;
};

/////////////////////////////////////////////////////////////////////////////////////////////
// setup / config//
/////////////////////////////////////////////////////////////////////////////////////////////

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));


/////////////////////////////////////////////////////////////////////////////////////////////
// Database //
/////////////////////////////////////////////////////////////////////////////////////////////

const urlDatabase = {
  'b2xVn2': { longURL: 'http://www.lighthouselabs.ca', user_id: null },
  '9sm5xK': { longURL: 'http://www.google.com', user_id: null },
  'wlzau': { longURL: 'http://www.discord.com', user_id: null },
  'imrro': { longURL: 'http://web.compass.lighthouselabs.ca', user_id: null },
  'l89ty': { longURL: 'http://www.youtube.com', user_id: null }
};

/////////////////////////////////////////////////////////////////////////////////////////////
// Database / Users //
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
  buttso: {
    id: "buttso",
    email: "robinrosefleur@gmail.com",
    password: "chocoCHIP",
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

const cookieParser = require('cookie-parser');
const { receiveMessageOnPort } = require("worker_threads");
const { get } = require("curl");
app.use(cookieParser());

app.get("/urls", (req, res) => {
  if (checkLogIn(req.cookies)) {
    const userId = req.cookies.user_id;
    const user = users[userId];
    const templateVars = { urls: urlDatabase, user };
    res.render("urls_index", templateVars);
  }
  res.status(400).send("You don't have permission to see these URLS.");
  // setTimeout(res.redirect("login"), 1000)
});


app.get("/new", (req, res) => {
  if (checkLogIn(req.cookies)) {
    const userId = req.cookies.user_id;
    const user = users[userId];

    const templateVars = { user };
    res.render("urls_new", templateVars);
  }
  res.redirect("login");
});


app.get("/urls/:id", (req, res) => {
  if (checkLogIn(req.cookies)) {
    const id = req.params.id;
    const longURL = urlDatabase[id].longURL;
    const userId = req.cookies.user_id;
    const user = users[userId];

    const templateVars = { longURL, user, id };
    res.render("urls_show", templateVars);
  }
  res.status(400).send("You don't have permission to see this URL.");
  res.redirect("login");
});

app.get("/login", (req, res) => {
  if (!checkLogIn(req.cookies)) {
    res.render("login", { user: null });
  }
  res.redirect("urls");
});

/////////////////////////////////////////////////////////////////////////////////////////////
// login checks//
/////////////////////////////////////////////////////////////////////////////////////////////

app.post("/login", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  let id = getUserByEmail(email);
  if (email === '' || password === '') {
    return res.send(400, '\nPlease enter your email AND password.');
  }
  if (!id) {
    return res.send(400, `\nNo account currently exists under that email, please Register!`);
  }
  if (password !== users[id].password) {
    return res.send(400, `\nThat password is Incorrect. This is a Debugging tool.`);
  }
  res.cookie('user_id', id);
  res.redirect("urls");
});

/////////////////////////////////////////////////////////////////////////////////////////////
// logout / delete cookie //
/////////////////////////////////////////////////////////////////////////////////////////////

app.post("/logout", (req, res) => {
  if (!checkLogIn(req.cookies)) {
    res.render("login", { user: null });
  }
  console.log('You have signed out');
  res.clearCookie('user_id');
  res.redirect("login");
});

/////////////////////////////////////////////////////////////////////////////////////////////
// view / edit / post //
/////////////////////////////////////////////////////////////////////////////////////////////

app.get("/urls/:id", (req, res) => {
  const userId = req.cookies.user_id;
  const user = users[userId];
  console.log('database check:', urlDatabase[req.params.id].user_id)
  if (!checkLogIn(req.cookies)) {
    res.render("login", { user: null });
  }
  if (userId !== urlDatabase[req.params.id].user_id) {
  }

  const templateVars = {
    urls: urlDatabase,
    user_id: req.cookies["user_id"],
    users: users
  };
  res.render("urls_edit", templateVars);
  res.redirect("login");
});

app.post("/urls/edit/:id", (req, res) => {
  const id = req.params.id;
  const updatedLongURL = req.body.longURL;
  const user_id = req.cookies.user_id
  console.log('id: ', id)
  console.log('urlDatabase[id].user_id: ', urlDatabase[id].user_id)
  if (user_id !== urlDatabase[id].user_id) {
    return res.status(400).send("You don't have permission to edit this URL");
  }
  urlDatabase[id].longURL = updatedLongURL;
  res.redirect("/urls");
});

/////////////////////////////////////////////////////////////////////////////////////////////
// delete / post //
/////////////////////////////////////////////////////////////////////////////////////////////

app.post("/urls/delete/:id", (req, res) => {
  const key = req.params.id;
  if (req.cookies.user_id === urlDatabase[key].user_id) {
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
// views / new //
/////////////////////////////////////////////////////////////////////////////////////////////



app.post("/urls", (req, res) => {
  let random = generateRandomString();
  if (checkLogIn(req.cookies)) {
    urlDatabase[random] = { longURL: req.body['longURL'], user_id: req.cookies.user_id };
  }
  res.redirect("/urls");
});

/////////////////////////////////////////////////////////////////////////////////////////////
// register //
/////////////////////////////////////////////////////////////////////////////////////////////

app.get("/register", (req, res) => {
  if (!checkLogIn(req.cookies)) {
    res.render("register", { user: null });
  }
  res.redirect("urls");
});

app.post("/register", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  if (email === '' || password === '') {
    return res.send(400, '\nPlease enter a valid email AND password.');
  }
  if (getUserByEmail(email) !== false) {
    return res.send(400, '\nAn account already exists under that email.');
  }
  let id = generateRandomString();
  users[id] = { id, email, password };
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
  const longURL = urlDatabase[id].longURL;
  for (indURL in urlDatabase) {
    if (id === indURL)
      res.redirect(longURL);
  }
  return res.status(404).send('This shortened URL does not exist');
});

app.get("/", (req, res) => {
  res.send("You've been logged out!");
});

