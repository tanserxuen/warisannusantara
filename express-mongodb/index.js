require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const routes = require('./routes.js');

const app = express();

const bodyParser = require("body-parser");

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});
app.use(bodyParser.json()); // to support JSON-encoded bodies
app.use(
  bodyParser.urlencoded({
    // to support URL-encoded bodies
    extended: true,
  })
);

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
console.log("Mongo connected!");

app.use(express.json()); // to support JSON-encoded bodies
app.use(express.urlencoded()); // to support URL-encoded bodies

app.set("views", path.join(__dirname, "../views"));
app.set("view engine", "html");
app.engine("html", require("ejs").renderFile);
app.use(express.static("public"));


app.use('/', routes);

var port = process.env.PORT || 3000;
app.listen(port, () => console.log(port + ":Server is running"));