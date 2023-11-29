const { randomFill } = require("crypto");
const { REFUSED } = require("dns");
const express = require("express");
const { url } = require("inspector");
const app = express();
const PORT = 8080; // default port 8080

const generateRandomString = function () {
  return Math.random().toString(36).substring(2,7);
}

app.set("view engine", "ejs")

const urlDatabase = {
  b2xVn2: 'http://www.lighthouselabs.ca',
  '9sm5xK': 'http://www.google.com',
  wlzau: 'http://www.discord.com',
  imrro: 'http://web.compass.lighthouselabs.ca',
  l89ty: 'http://www.youtube.com'
};

app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get('/show/:key', (req, res) => {
  const id = req.params;
  const templateVars = {
    url: urlDatabase[id]
  };
  res.render('show')
})

app.get("/urls/edit/:id", (req, res) => {
  const templateVars = {urls: urlDatabase, longURL: urlDatabase[req.params.id], id: req.params.id};
  res.render('urls_edit', templateVars);
});

app.get("/set", (req, res) => {
  const a = 1;
  res.send(`a = ${a}`);
 });

app.get("/urls/new", (req, res) => {
  res.render("urls_new");
 })
 
app.post("/urls/delete/:id", (req, res) => {
  const key = req.params.id;
  delete urlDatabase[key];
  // urlDatabase = (urlDatabase.splice(key, 1)) -- not an array, cannot splice.
  res.redirect("/urls");
});
app.post("/login", (req, res) => {
  const username = req.body.username;
  console.log('setting cookie!')
  res.cookie('username', username)
  res.redirect("/urls");
});

app.post("/urls/edit/:id", (req, res) => {
  const key = req.params.id;
  const updatedLongURL = req.body.longURL;
  urlDatabase[key] = updatedLongURL;
  res.redirect("/urls");
});

app.post("/urls", (req, res) => {
  let random = generateRandomString()
  urlDatabase[random] = req.body['longURL'] 
  res.redirect("/urls")
})

app.get("/u/:id", (req, res) => {
  const id = req.params.id;
  const longURL = urlDatabase[id]
  res.redirect(longURL);
});

app.get("/urls/:id", (req, res) => {
const templateVars = { id: req.params.id, longURL: urlDatabase[req.params.id]};
  res.render("urls_show", templateVars);
});

app.get("/urls", (req, res) => {
  const templateVars = {urls: urlDatabase}; 
  res.render("urls_index", templateVars)
})

 app.get("/fetch", (req, res) => {
  res.send(`a = ${a}`);
 });


app.listen(PORT, () => {
  console.log(`TinyApp listening on port ${PORT}!`);
});