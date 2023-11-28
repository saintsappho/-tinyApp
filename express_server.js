const express = require("express");
const { url } = require("inspector");
const app = express();
const PORT = 8080; // default port 8080

app.set("view engine", "ejs")

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

app.get("/", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/set", (req, res) => {
  const a = 1;
  res.send(`a = ${a}`);
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
  console.log(`Example app listening on port ${PORT}!`);
});