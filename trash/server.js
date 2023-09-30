const express = require('express');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');
// const knex = require('knex');
const port = 3000; // You can choose any port you prefer

let intialPath = path.join(__dirname, "templates/");

app.use(bodyParser.json());
app.use(express.static(intialPath));

app.get('/', (req, res) => {
  res.sendFile(path.join(intialPath, "login.html"));
});

app.get('/profile', (req, res) => {
  res.sendFile(path.join(intialPath, "profile.html"));
});

app.get('/register', (req, res) => {
  res.sendFile(path.join(intialPath, "register.html"));
});

app.get('/logout', (req, res) => {
  res.sendFile(path.join(intialPath, "login.html"));
});

app.listen(port, (req, res) => {
  console.log(`Server is running on http://localhost:${port}`);
});
