const express = require("express");
const mongoose = require("mongoose");
const { saveUser, authenticateUser, register } = require("./service/userService");
const { User } = require("./schema/userSchema");
require("dotenv").config();
const path = require("path");

const app = express();

const bodyParser = require("body-parser");
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

app.post("/login", async (req, res) => {
  await authenticateUser(req.body.email, req.body.password)
    .then((result) => {
      result
        ? res.sendFile(path.join(__dirname, "../index.html"))
        : res.sendFile(path.join(__dirname, "../login.html"));
      //TODO: display error message on invalid credentials
    })
    .catch((err) => console.log(err));
});

app.get("/register", async (req, res) => {
  res.sendFile(path.join(__dirname, "../register.html"));
});

app.post("/register", async (req, res) => {
  await register(req.body.name, req.body.email, req.body.password).then((result) => {
    result
      ? res.sendFile(path.join(__dirname, "../login.html"))
      : res.sendFile(path.join(__dirname, "../register.html"));
    //TODO: display error message on register server error
  })
  .catch((err) => console.log(err));;
});

app.get("/users", (req, res) => {
  User.find({}, (err, found) => {
    if (!err) {
      res.send(found);
    }
    console.log(err);
    res.send("Some error occured!");
  }).catch((err) => console.log("Error occured, " + err));
});

app.get("/*", (req, res) => {
  res.sendFile(path.join(__dirname, "../login.html"));
  //TODO: use redirect to change the url
});

app.listen(3000, () => console.log("Server is running"));
