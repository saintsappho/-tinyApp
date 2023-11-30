/////////////////////////////////////////////////////////////////////////////////////////////
// setup / consts //
/////////////////////////////////////////////////////////////////////////////////////////////

const { randomFill } = require("crypto");
const { REFUSED } = require("dns");
const express = require("express");
const { url } = require("inspector");
const app = express();
const PORT = 8080; // default port 8080
const generateRandomString = function () {
  return Math.random().toString(36).substring(2,7);
}

/////////////////////////////////////////////////////////////////////////////////////////////
// database //
/////////////////////////////////////////////////////////////////////////////////////////////

const database = {b2xVn2: 'http://www.lighthouselabs.ca',
  '9sm5xK': 'http://www.google.com',
  wlzau: 'http://www.discord.com',
  imrro: 'http://web.compass.lighthouselabs.ca',
  l89ty: 'http://www.youtube.com'
};

/////////////////////////////////////////////////////////////////////////////////////////////
// setup / config//
/////////////////////////////////////////////////////////////////////////////////////////////

app.set("view engine", "ejs")

app.use(express.urlencoded({ extended: true }));

/////////////////////////////////////////////////////////////////////////////////////////////
// app.listener //
/////////////////////////////////////////////////////////////////////////////////////////////

app.listen(PORT, () => {
  console.log(`TinyApp listening on port ${PORT}!`);
});

/////////////////////////////////////////////////////////////////////////////////////////////
// trying to share cookies across pages //
/////////////////////////////////////////////////////////////////////////////////////////////

const cookieParser = require('cookie-parser');
app.use(cookieParser());

app.get("/urls", (req, res) => {
  const templateVars = {
    urls: database,
    username: req.cookies["username"]
  };
  console.log('templateVars: ', templateVars)
  res.render("urls_index", templateVars);
});

app.get("/:id", (req, res) => {
  const templateVars = {
    urls: database,
    username: req.cookies["username"]
  };
  console.log('templateVars: ', templateVars)
  res.render("urls_show", templateVars);
});

app.get("/edit", (req, res) => {
  const templateVars = {
    urls: database,
    username: req.cookies["username"]
  };
  console.log('templateVars: ', templateVars)
  res.render("urls_edit", templateVars);
});

app.get("/new", (req, res) => {
  const templateVars = {
    urls: database,
    username: req.cookies["username"]
  };
  console.log('templateVars: ', templateVars)
  res.render("urls_new", templateVars);
});


/////////////////////////////////////////////////////////////////////////////////////////////
// login / set cookie / logout / clear cookie //
/////////////////////////////////////////////////////////////////////////////////////////////

app.post("/login", (req, res) => {
  const username = req.body.username;
  res.cookie('username', username)
  console.log('signed in as: ', username)
  res.redirect("/urls");
});

/////////////////////////////////////////////////////////////////////////////////////////////
// logout / delete cookie??? //
/////////////////////////////////////////////////////////////////////////////////////////////

app.post("/logout", (req, res) => {
  console.log('You have signed out', )
  res.clearCookie('username')
  res.redirect("/urls");
});

/////////////////////////////////////////////////////////////////////////////////////////////
// view / edit / post //
/////////////////////////////////////////////////////////////////////////////////////////////

app.get("/urls/edit/:id", (req, res) => {
  const templateVars = {urls: database, longURL: database[req.params.id], id: req.params.id, username: req.cookies["username"]};
  res.render('urls_edit', templateVars);
});

app.post("/urls/edit/:id", (req, res) => {
  const key = req.params.id;
  const updatedLongURL = req.body.longURL;
  database[key] = updatedLongURL;
  res.redirect("/urls");
});

/////////////////////////////////////////////////////////////////////////////////////////////
// delete / post //
/////////////////////////////////////////////////////////////////////////////////////////////

app.post("/urls/delete/:id", (req, res) => {
  const key = req.params.id;
  delete database[key];
  // database = (database.splice(key, 1)) -- not an array, cannot splice.
  res.redirect("/urls");
});

/////////////////////////////////////////////////////////////////////////////////////////////
// site / JSON //
/////////////////////////////////////////////////////////////////////////////////////////////

app.get("/urls.json", (req, res) => {
  res.json(database);
});

/////////////////////////////////////////////////////////////////////////////////////////////
// views / new //
/////////////////////////////////////////////////////////////////////////////////////////////

app.get("/urls/new", (req, res) => {
  const templateVars = { id: req.params.id, longURL: database[req.params.id], username: req.cookies["username"]};
  res.render("urls_new", templateVars);
})

app.post("/urls", (req, res) => {
  let random = generateRandomString()
  database[random] = req.body['longURL'] 
  res.redirect("/urls")
})

/////////////////////////////////////////////////////////////////////////////////////////////
// views / show / index/
/////////////////////////////////////////////////////////////////////////////////////////////

app.get('/show/:key', (req, res) => {
  const id = req.params;
  const templateVars = {
    url: database[id]
  };
  res.render('show')
})

app.get("/u/:id", (req, res) => {
  const id = req.params.id;
  const longURL = database[id]
  res.redirect(longURL);
});

app.get("/set", (req, res) => {
  const a = 1;
  res.send(`a = ${a}`);
});

app.get("/urls/:id", (req, res) => {
  const templateVars = { id: req.params.id, longURL: database[req.params.id], username: req.cookies["username"]};
  res.render("urls_show", templateVars);
});

app.get("/urls", (req, res) => {
  const templateVars = {urls: database, username: req.cookies["username"]}; 
  res.render("urls_index", templateVars)
})

app.get("/fetch", (req, res) => {
  res.send(`a = ${a}`);
});